package com.project.hrcm.services;

import com.project.hrcm.models.requests.document.LaborContractRequest;
import com.project.hrcm.utils.Utils;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Service
public class DocxService {

    public byte[] generateDocx(LaborContractRequest laborContractRequest) throws Exception {

        // convert your DTO into a Map<String,String>
        Map<String, String> data = Utils.covertObjectToMap(laborContractRequest);

        // Load template from classpath
        ClassPathResource resource = new ClassPathResource("files/laborContract/"+laborContractRequest.getFileName());
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
}

