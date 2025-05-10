package com.project.hrcm.controllers;

import com.project.hrcm.models.requests.document.LaborContractRequest;
import com.project.hrcm.services.DocxService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/docx")
public class DocxController {
  private final DocxService docxService;

  public DocxController(DocxService docxService) {
    this.docxService = docxService;
  }

  @PostMapping("/generate")
  public ResponseEntity<byte[]> generate(@RequestBody LaborContractRequest laborContractRequest) {
    try {
      byte[] docBytes = docxService.generateDocx(laborContractRequest);

      return ResponseEntity.ok()
          .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=filled.docx")
          .contentType(
              MediaType.parseMediaType(
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
          .body(docBytes);

    } catch (Exception e) {
      return ResponseEntity.status(500)
          .body(("Error generating document: " + e.getMessage()).getBytes());
    }
  }

  @GetMapping("/getHtml/{contractTemplateId}")
  public String convertDocx(@PathVariable Integer contractTemplateId) {
    try {
      return docxService.convertDocxToHtml(contractTemplateId);
    } catch (IOException e) {
      return "<html><body><h2>Error:</h2><pre>" + e.getMessage() + "</pre></body></html>";
    }
  }
}
