package com.project.hrcm.services;

import com.project.hrcm.entities.ContractTemplate;
import com.project.hrcm.models.requests.document.LaborContractRequest;
import com.project.hrcm.utils.Utils;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DocxService {

  private static final String pathFile = "files/laborContract/";

  // set param in docx
  public byte[] generateDocx(LaborContractRequest laborContractRequest) throws Exception {

    // convert your DTO into a Map<String,String>
    Map<String, String> data = Utils.covertObjectToMap(laborContractRequest);

    Path filePath = Paths.get(pathFile).resolve(laborContractRequest.getFileName()).normalize();

    Resource resource = new UrlResource(filePath.toUri());

    try (InputStream is = resource.getInputStream();
        XWPFDocument doc = new XWPFDocument(is);
        ByteArrayOutputStream out = new ByteArrayOutputStream()) {

      // Replace placeholders in paragraphs
      for (XWPFParagraph p : doc.getParagraphs()) {
        replaceInParagraph(p, data);
      }

      // Replace placeholders in tables (if any)
      for (XWPFTable tbl : doc.getTables()) {
        for (XWPFTableRow row : tbl.getRows()) {
          for (XWPFTableCell cell : row.getTableCells()) {
            for (XWPFParagraph p : cell.getParagraphs()) {
              replaceInParagraph(p, data);
            }
          }
        }
      }

      // Write out the filled document
      doc.write(out);
      return out.toByteArray();
    }
  }

  private void replaceInParagraph(XWPFParagraph paragraph, Map<String, String> data) {
    List<XWPFRun> runs = paragraph.getRuns();
    if (runs == null) return;

    StringBuilder paragraphText = new StringBuilder();
    for (XWPFRun run : runs) {
      paragraphText.append(run.getText(0));
    }
    String replaced = paragraphText.toString();

    // Replace all placeholders
    for (Map.Entry<String, String> entry : data.entrySet()) {
      replaced = replaced.replace("${" + entry.getKey() + "}", entry.getValue());
    }

    // If anything changed, clear and re‑write the runs
    if (!replaced.contentEquals(paragraphText)) {
      for (int i = runs.size() - 1; i >= 0; i--) {
        paragraph.removeRun(i);
      }
      XWPFRun newRun = paragraph.createRun();
      newRun.setText(replaced, 0);
    }
  }

  // get param in docx
  private List<String> extractParamsFromDocx(MultipartFile file) throws IOException {
    List<String> foundParams = new ArrayList<>();
    Pattern pattern = Pattern.compile("\\$\\{(.*?)\\}");

    try (InputStream inputStream = file.getInputStream();
        XWPFDocument document = new XWPFDocument(inputStream)) {

      for (XWPFParagraph para : document.getParagraphs()) {
        String text = para.getText();
        Matcher matcher = pattern.matcher(text);
        while (matcher.find()) {
          foundParams.add(matcher.group(1).trim()); // e.g. param1, param2
        }
      }
    }

    return foundParams;
  }

  public void saveDocx(MultipartFile file, ContractTemplate contractTemplate) throws IOException {

    // Get param in docx
    List<String> params = extractParamsFromDocx(file);

    // Get the original file name
    String originalFilename = file.getOriginalFilename();

    // Plus date in fileName
    if (StringUtils.isNotBlank(originalFilename)) {
      String[] splitFileName = originalFilename.split("\\.");
      splitFileName[0] = splitFileName[0] + LocalDateTime.now().getNano();
      originalFilename = splitFileName[0] + "." + splitFileName[1];
    }

    // Get the file content as bytes
    byte[] bytes = file.getBytes();

    // Create directory if not exists
    Files.createDirectories(Paths.get(pathFile));

    // Save the file to a specific path
    Path path = Paths.get(pathFile + originalFilename);
    Files.write(path, bytes);

    // Set contactTemplate
    contractTemplate.setParams(Utils.gson.toJson(params));
    contractTemplate.setFilePath(path.toString());
  }
}
