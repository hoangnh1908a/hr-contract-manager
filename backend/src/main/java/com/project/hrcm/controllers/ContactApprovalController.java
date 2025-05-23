package com.project.hrcm.controllers;

import com.project.hrcm.entities.ContractApproval;
import com.project.hrcm.models.requests.*;
import com.project.hrcm.services.ContactApprovalService;
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
@RequestMapping("/contactApproval")
public class ContactApprovalController {

  private final ContactApprovalService service;

  @GetMapping()
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Page<ContractApproval>> getContactApprovals(
      ContractApprovalRequest contractApprovalRequest, Pageable pageable) {
    Page<ContractApproval> contactApprovals =
        service.getContactApprovals(contractApprovalRequest, pageable);
    return new ResponseEntity<>(contactApprovals, HttpStatus.OK);
  }

  @PostMapping("/get")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<ContractApproval> getContactApprovalById(
      @Valid @RequestBody String id, Locale locale) {
    return new ResponseEntity<>(
        service.getContactApprovalById(Integer.valueOf(id), locale), HttpStatus.OK);
  }

  @PostMapping("/create")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<ContractApproval> createContactApproval(
      @Valid @RequestBody ContactApprovalValidateRequest nameRequest, Locale locale) {
    return new ResponseEntity<>(service.createContactApproval(nameRequest, locale), HttpStatus.OK);
  }

  @PostMapping("/delete")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<String> deleteContactApproval(
      @Valid @RequestBody String id, Locale locale) {
    service.deleteContactApproval(Integer.valueOf(id), locale);
    return ResponseEntity.ok(Constants.SUCCESS);
  }
}
