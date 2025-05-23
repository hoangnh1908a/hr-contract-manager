package com.project.hrcm.controllers;

import com.project.hrcm.entities.Contract;
import com.project.hrcm.models.reponse.DownloadContractResponse;
import com.project.hrcm.models.requests.noRequired.ContractRequest;
import com.project.hrcm.services.ContractService;
import com.project.hrcm.utils.Constants;
import jakarta.validation.Valid;
import java.util.Locale;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/contract")
public class ContractController {

  private final ContractService service;

  @GetMapping()
  @PreAuthorize(
      "hasAnyAuthority(T(com.project.hrcm.utils.Constants).ROLE_ADMIN"
          + ", T(com.project.hrcm.utils.Constants).ROLE_HR)")
  public ResponseEntity<Page<Contract>> getContract(
      ContractRequest contractRequest, Pageable pageable) {
    Page<Contract> contracts = service.getContracts(contractRequest, pageable);
    return new ResponseEntity<>(contracts, HttpStatus.OK);
  }

  @PostMapping("/create")
  @PreAuthorize(
      "hasAnyAuthority(T(com.project.hrcm.utils.Constants).ROLE_ADMIN"
          + ", T(com.project.hrcm.utils.Constants).ROLE_HR)")
  public ResponseEntity<Contract> createContract(
      @Valid @RequestBody ContractRequest contractRequest, Locale locale) {
    return new ResponseEntity<>(service.createContract(contractRequest, locale), HttpStatus.OK);
  }

  @PostMapping("/delete")
  @PreAuthorize(
      "hasAnyAuthority(T(com.project.hrcm.utils.Constants).ROLE_ADMIN"
          + ", T(com.project.hrcm.utils.Constants).ROLE_HR)")
  public ResponseEntity<String> deleteContract(@Valid @RequestBody String id, Locale locale) {
    service.deleteContract(Integer.valueOf(id), locale);
    return ResponseEntity.ok(Constants.SUCCESS);
  }

  @PostMapping("/download")
  public ResponseEntity<byte[]> downloadDocxFile(@Valid @RequestBody Integer id, Locale locale) {
    DownloadContractResponse response = service.downloadContract(id, locale);
    // Return the file as a ResponseEntity
    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            "attachment; filename=\"" + response.getFileName() + "\"")
        .contentType(MediaType.APPLICATION_OCTET_STREAM)
        .body(response.getFile());
  }

  @PostMapping("/terminated")
  @PreAuthorize(
      "hasAnyAuthority(T(com.project.hrcm.utils.Constants).ROLE_ADMIN"
          + ", T(com.project.hrcm.utils.Constants).ROLE_HR)")
  public ResponseEntity<String> contractTerminated(@Valid @RequestBody String id, Locale locale) {
    service.deleteContract(Integer.valueOf(id), locale);
    return ResponseEntity.ok(Constants.SUCCESS);
  }
}
