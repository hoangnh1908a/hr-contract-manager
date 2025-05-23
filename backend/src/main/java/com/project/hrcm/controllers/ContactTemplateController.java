package com.project.hrcm.controllers;

import com.project.hrcm.entities.ContractTemplate;
import com.project.hrcm.models.requests.noRequired.ContactTemplateRequest;
import com.project.hrcm.services.ContractTemplateService;
import com.project.hrcm.utils.Constants;
import jakarta.validation.Valid;
import java.util.Locale;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@RestController
@RequestMapping("/contractTemplate")
public class ContactTemplateController {

  private final ContractTemplateService service;

  @GetMapping()
  @PreAuthorize(
      "hasAnyAuthority(T(com.project.hrcm.utils.Constants).ROLE_ADMIN"
          + ", T(com.project.hrcm.utils.Constants).ROLE_HR)")
  public ResponseEntity<Page<ContractTemplate>> getContractTemplateees(
      ContactTemplateRequest contactTemplateRequest, Pageable pageable) {
    Page<ContractTemplate> contactTemplate =
        service.getContactTemplate(contactTemplateRequest, pageable);
    return new ResponseEntity<>(contactTemplate, HttpStatus.OK);
  }

  @PostMapping("/create")
  @PreAuthorize(
      "hasAnyAuthority(T(com.project.hrcm.utils.Constants).ROLE_ADMIN"
          + ", T(com.project.hrcm.utils.Constants).ROLE_HR)")
  public ResponseEntity<ContractTemplate> createContactTemplate(
      @RequestParam("file") MultipartFile file,
      @RequestParam("fileName") String fileName,
      @RequestParam("fileNameEn") String fileNameEn,
      @RequestParam("description") String description,
      @RequestParam("status") Integer status,
      Locale locale)
      throws Exception {
    return new ResponseEntity<>(
        service.createContactTemplate(file, fileName, fileNameEn, description, status, locale),
        HttpStatus.OK);
  }

  @PostMapping("/update")
  @PreAuthorize(
      "hasAnyAuthority(T(com.project.hrcm.utils.Constants).ROLE_ADMIN"
          + ", T(com.project.hrcm.utils.Constants).ROLE_HR)")
  public ResponseEntity<ContractTemplate> updateContractTemplate(
      @RequestParam("file") MultipartFile file,
      @RequestParam("fileName") String fileName,
      @RequestParam("fileNameEn") String fileNameEn,
      @RequestParam("description") String description,
      @RequestParam("status") Integer status,
      Locale locale) {
    return new ResponseEntity<>(
        service.updateContractTemplate(file, fileName, fileNameEn, description, status, locale),
        HttpStatus.OK);
  }

  @PostMapping("/delete")
  @PreAuthorize(
      "hasAnyAuthority(T(com.project.hrcm.utils.Constants).ROLE_ADMIN"
          + ", T(com.project.hrcm.utils.Constants).ROLE_HR)")
  public ResponseEntity<String> deleteContractTemplateee(
      @Valid @RequestBody Integer id, Locale locale) {
    service.deleteContactTemplate(id, locale);
    return ResponseEntity.ok(Constants.SUCCESS);
  }
}
