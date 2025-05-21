package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.ContractTemplate;
import com.project.hrcm.models.requests.document.LaborContractRequest;
import com.project.hrcm.repository.ContractTemplateRepository;
import com.project.hrcm.utils.Utils;
import io.micrometer.common.util.StringUtils;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.AllArgsConstructor;
import org.apache.poi.util.StringUtil;
import org.apache.poi.xwpf.usermodel.*;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.docx4j.Docx4J;
import org.docx4j.convert.in.xhtml.XHTMLImporterImpl;
import org.docx4j.convert.out.HTMLSettings;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.openpackaging.parts.WordprocessingML.MainDocumentPart;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@Service
public class DocxService {

  private static final Logger log = LoggerFactory.getLogger(DocxService.class);

  private static final String pathFile = "files/laborContract/";

  private final ContractTemplateRepository contractTemplateRepository;

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
      String text = run.getText(0);
      if (text != null) {
        paragraphText.append(text);
      }
    }

    String replacedText = paragraphText.toString();

    // Thay thế placeholder
    for (Map.Entry<String, String> entry : data.entrySet()) {
      replacedText = replacedText.replace("${" + entry.getKey() + "}", entry.getValue());
    }

    // Nếu có thay đổi thì ghi đè
    if (!replacedText.contentEquals(paragraphText)) {
      for (int i = runs.size() - 1; i >= 0; i--) {
        paragraph.removeRun(i);
      }
      XWPFRun newRun = paragraph.createRun();
      newRun.setText(replacedText, 0);
    }
  }

  // get param in docx
  private List<String> extractParamsFromDocx(MultipartFile file) throws IOException {
    log.info(" Start add params in docx");

    List<String> foundParams = new ArrayList<>();
    Pattern pattern = Pattern.compile("\\$\\{(.*?)}");

    try (InputStream inputStream = file.getInputStream()) {
      XWPFDocument document = new XWPFDocument(inputStream);

      for (XWPFParagraph para : document.getParagraphs()) {
        String text = para.getText();
        Matcher matcher = pattern.matcher(text);
        while (matcher.find()) {
          foundParams.add(matcher.group(1).trim()); // e.g. param1, param2
        }
      }
    }

    log.info(" End add params in docx {} ", foundParams);

    return foundParams;
  }

  public void saveDocx(MultipartFile file, ContractTemplate contractTemplate) throws Exception {

    // remove file before update
    if (StringUtils.isNotBlank(contractTemplate.getFilePath())) {
      Files.deleteIfExists(Paths.get(contractTemplate.getFilePath()).normalize()); // delete file docx
      String pathHtml = contractTemplate.getFilePath().replace(".docx", ".html");
      Files.deleteIfExists(Paths.get(pathHtml).normalize()); // delete file html

    }

    log.info(" Start save docx !");
    Path savedFilePath = null;

    try {
      if (file == null
          || file.isEmpty()
          || !Objects.requireNonNull(file.getOriginalFilename()).endsWith(".docx")) {
        throw new IllegalArgumentException("File không hợp lệ hoặc không phải file .docx");
      }

      String originalFilename = file.getOriginalFilename();

      // Thêm thời gian vào tên file để tránh trùng
      assert originalFilename != null;
      String fileExt = originalFilename.substring(originalFilename.lastIndexOf("."));
      String nameOnly = originalFilename.substring(0, originalFilename.lastIndexOf("."));
      originalFilename = nameOnly + "_" + LocalDateTime.now().getNano() + fileExt;

      // Lưu file gốc
      byte[] bytes = file.getBytes();
      Files.createDirectories(Paths.get(pathFile));
      Path path = Paths.get(pathFile, originalFilename);
      Files.write(path, bytes);

      savedFilePath = path;

      // Trích xuất tham số
      List<String> params = extractParamsFromDocx(file);
      // Chuyển đổi HTML
      // Tạo tên file mới
      String baseName = originalFilename.replaceAll("\\.docx$", "");
      String htmlFileName = baseName + ".html";
      convertAndSaveHtml(file.getInputStream(), htmlFileName);

      // Cập nhật thông tin ContractTemplate
      contractTemplate.setParams(Utils.gson.toJson(params));
      contractTemplate.setFilePath(path.toString());

      log.info("Save docx success !");
    } catch (Exception e) {
      log.error("Error saving docx: ", e);
      // Nếu có lỗi, xóa file đã lưu
      if (savedFilePath != null) {
        try {
          Files.deleteIfExists(savedFilePath);
          log.info("Successfully removed file after error: {}", savedFilePath);
        } catch (IOException deleteException) {
          log.error("Failed to remove file after error: {}", savedFilePath, deleteException);
          // Có thể re-throw exception ban đầu hoặc wrap nó
          throw new Exception("Lỗi khi lưu và dọn dẹp file docx", e);
        }
      }
      throw e; // Re-throw exception để controller xử lý
    }
  }

  @Async
  public void convertAndSaveHtml(InputStream docxInputStream, String outputFileName) {
    try {
      log.info("Start save file html name {} ", outputFileName);
      ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

      WordprocessingMLPackage wordMLPackage = WordprocessingMLPackage.load(docxInputStream);

      HTMLSettings htmlSettings = Docx4J.createHTMLSettings();
      htmlSettings.setWmlPackage(wordMLPackage);

      Docx4J.toHTML(htmlSettings, outputStream, Docx4J.FLAG_EXPORT_PREFER_XSL);
      String htmlContent = outputStream.toString(StandardCharsets.UTF_8);

      Path path = Paths.get(pathFile + outputFileName);
      Files.createDirectories(path.getParent());
      Files.write(path, htmlContent.getBytes());

      log.info("End save file html !");
    } catch (Exception e) {
      // Log lỗi
      throw new CustomException("Save file html error " + e.getMessage());
    }
  }

  public String convertDocxToHtml(Integer contractTemplateId) throws IOException {
    log.info("Start get file html by id {} ", contractTemplateId);
    ContractTemplate contractTemplate =
        contractTemplateRepository.findById(contractTemplateId).orElse(null);

    if (contractTemplate == null) {
      log.info(" CovertDocxToHtml ContractTemplate is null ");
      return "";
    }

    String baseName = contractTemplate.getFilePath().replaceAll("\\.docx$", "");
    String htmlFileName = baseName + ".html";

    return Files.readString(Paths.get(htmlFileName));
  }

  public String htmlToDocxBytes(String html, String fileName) {
    try{
      String filePath = pathFile + fileName + System.currentTimeMillis() + ".docx";
    // 1) Create a new empty Word document
    WordprocessingMLPackage wordPkg = WordprocessingMLPackage.createPackage();

    // 2) Get its MainDocumentPart
    MainDocumentPart main = wordPkg.getMainDocumentPart();

    // 3) Use the XHTML importer to parse & add your HTML
    XHTMLImporterImpl xhtmlImporter = new XHTMLImporterImpl(wordPkg);
    main.getContent().addAll(xhtmlImporter.convert(html, null));

    // 4) Save to a byte[] and return
    try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
      wordPkg.save(out);

      Path path = Paths.get(filePath);
      Files.createDirectories(path.getParent());
      Files.write(path, out.toByteArray());

      return path.toString();

    }catch (Exception e){
      log.error("Save file to html error : {}", e.getMessage());
      Files.deleteIfExists(Paths.get(filePath));
      throw new CustomException("Save file to html error ");
    }
    }catch (Exception e){
      log.error("Get byte to html error : {}", e.getMessage());
      throw new CustomException("Get byte to html error ");
    }
  }
}
