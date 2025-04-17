package com.project.hrcm.controllers;

import com.project.hrcm.entities.ContactApproval;
import com.project.hrcm.models.requests.*;
import com.project.hrcm.services.ContactApprovalService;
import com.project.hrcm.utils.Constants;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Locale;
import lombok.AllArgsConstructor;
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
  public ResponseEntity<List<ContactApproval>> getContactApprovals() {
    List<ContactApproval> contactApprovals = service.getContactApprovals();
    return new ResponseEntity<>(contactApprovals, HttpStatus.OK);
  }

  @PostMapping("/get")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<ContactApproval> getContactApprovalById(
          @Valid @RequestBody String id, Locale locale) {
    return new ResponseEntity<>(
        service.getContactApprovalById(Integer.valueOf(id), locale), HttpStatus.OK);
  }

  @PostMapping("/add")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<ContactApproval> createContactApproval(
          @Valid @RequestBody ContactApprovalValidateRequest nameRequest, Locale locale) {
    return new ResponseEntity<>(service.createContactApproval(nameRequest, locale), HttpStatus.OK);
  }

  @PostMapping("/update")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<ContactApproval> updateContactApproval(
          @Valid @RequestBody ContactApprovalValidateRequest baseRequest, Locale locale) {
    return new ResponseEntity<>(service.updateContactApproval(baseRequest, locale), HttpStatus.OK);
  }

  @PostMapping("/delete")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<String> deleteContactApproval(
          @Valid @RequestBody String id, Locale locale) {
    service.deleteContactApproval(Integer.valueOf(id), locale);
    return ResponseEntity.ok(Constants.SUCCESS);
  }
}
