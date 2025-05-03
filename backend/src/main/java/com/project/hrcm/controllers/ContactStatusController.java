package com.project.hrcm.controllers;

import com.project.hrcm.entities.ContractStatus;
import com.project.hrcm.models.requests.BaseValidateRequest;
import com.project.hrcm.models.requests.NameValidateRequest;
import com.project.hrcm.models.requests.noRequired.ContractStatusRequest;
import com.project.hrcm.services.ContactStatusService;
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

@AllArgsConstructor
@RestController
@RequestMapping("/contactStatus")
public class ContactStatusController {

  private final ContactStatusService service;

  @GetMapping()
  @PreAuthorize(
      "hasAnyAuthority(T(com.project.hrcm.utils.Constants).ROLE_ADMIN"
          + ", T(com.project.hrcm.utils.Constants).ROLE_HR)")
  public ResponseEntity<Page<ContractStatus>> getContactStatus(@RequestParam(required = false) String name, Pageable pageable) {
    Page<ContractStatus> contactStatus = service.getContactStatus(name, pageable);
    return new ResponseEntity<>(contactStatus, HttpStatus.OK);
  }

  @PostMapping("/create")
  @PreAuthorize(
      "hasAnyAuthority(T(com.project.hrcm.utils.Constants).ROLE_ADMIN"
          + ", T(com.project.hrcm.utils.Constants).ROLE_HR)")
  public ResponseEntity<ContractStatus> createContactStatus(
          @Valid @RequestBody ContractStatusRequest contractStatusRequest, Locale locale) {
    return new ResponseEntity<>(service.createContactStatus(contractStatusRequest, locale), HttpStatus.OK);
  }

  // Update ContactStatus
  @PostMapping("/update")
  @PreAuthorize(
      "hasAnyAuthority(T(com.project.hrcm.utils.Constants).ROLE_ADMIN"
          + ", T(com.project.hrcm.utils.Constants).ROLE_HR)")
  public ResponseEntity<ContractStatus> updateContactStatus(
          @Valid @RequestBody ContractStatusRequest contractStatusRequest, Locale locale) {
    return new ResponseEntity<>(service.updateContactStatus(contractStatusRequest, locale), HttpStatus.OK);
  }

  // Delete ContactStatus
  @PostMapping("/delete")
  @PreAuthorize(
      "hasAnyAuthority(T(com.project.hrcm.utils.Constants).ROLE_ADMIN"
          + ", T(com.project.hrcm.utils.Constants).ROLE_HR)")
  public ResponseEntity<String> deleteContactStatus(
          @Valid @RequestBody String id, Locale locale) {
    service.deleteContactStatus(Integer.valueOf(id), locale);

    return ResponseEntity.ok(Constants.SUCCESS);
  }
}
