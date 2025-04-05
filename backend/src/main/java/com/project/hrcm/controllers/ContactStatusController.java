package com.project.hrcm.controllers;

import com.project.hrcm.entities.ContactStatus;
import com.project.hrcm.models.requests.BaseRequest;
import com.project.hrcm.models.requests.IdRequest;
import com.project.hrcm.models.requests.NameRequest;
import com.project.hrcm.services.ContactStatusService;
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
@RequestMapping("/contactStatus")
public class ContactStatusController {

  private final ContactStatusService service;

  @GetMapping()
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + ", " + Constants.ROLE_HR + "')")
  public ResponseEntity<List<ContactStatus>> getContactStatus() {
    List<ContactStatus> contactStatus = service.getContactStatus();
    return new ResponseEntity<>(contactStatus, HttpStatus.OK);
  }

  @PostMapping("/get")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + ", " + Constants.ROLE_HR + "')")
  public ResponseEntity<ContactStatus> getContactStatusById(
      @Valid @RequestBody IdRequest idRequest, Locale locale) {
    return new ResponseEntity<>(
        service.getContactStatusById(idRequest.getId(), locale), HttpStatus.OK);
  }

  @PostMapping("/add")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + ", " + Constants.ROLE_HR + "')")
  public ResponseEntity<ContactStatus> createContactStatus(
      @Valid @RequestBody NameRequest nameRequest, Locale locale) {
    return new ResponseEntity<>(service.createContactStatus(nameRequest, locale), HttpStatus.OK);
  }

  // Update ContactStatus
  @PostMapping("/update")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + ", " + Constants.ROLE_HR + "')")
  public ResponseEntity<ContactStatus> updateContactStatus(
      @Valid @RequestBody BaseRequest baseRequest, Locale locale) {
    return new ResponseEntity<>(service.updateContactStatus(baseRequest, locale), HttpStatus.OK);
  }

  // Delete ContactStatus
  @PostMapping("/delete")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + ", " + Constants.ROLE_HR + "')")
  public ResponseEntity<String> deleteContactStatus(
      @Valid @RequestBody IdRequest idRequest, Locale locale) {
    service.deleteContactStatus(idRequest.getId(), locale);

    return ResponseEntity.ok(Constants.SUCCESS);
  }
}
