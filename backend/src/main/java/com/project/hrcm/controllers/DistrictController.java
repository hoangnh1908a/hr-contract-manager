package com.project.hrcm.controllers;

import com.project.hrcm.entities.District;
import com.project.hrcm.models.requests.BaseValidateRequest;
import com.project.hrcm.models.requests.NameValidateRequest;
import com.project.hrcm.services.DistrictService;
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
@RequestMapping("/district")
public class DistrictController {

  private final DistrictService service;

  @GetMapping()
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<List<District>> getDistricts() {
    List<District> districts = service.getDistricts();
    return new ResponseEntity<>(districts, HttpStatus.OK);
  }

  @PostMapping("/get")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<District> getDistrictById(
          @Valid @RequestBody String id, Locale locale) {
    return new ResponseEntity<>(service.getDistrictById(Integer.valueOf(id), locale), HttpStatus.OK);
  }

  @PostMapping("/add")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<District> createDistrict(
          @Valid @RequestBody NameValidateRequest nameValidateRequest, Locale locale) {
    return new ResponseEntity<>(service.createDistrict(nameValidateRequest, locale), HttpStatus.OK);
  }

  // Update District
  @PostMapping("/update")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<District> updateDistrict(
          @Valid @RequestBody BaseValidateRequest baseValidateRequest, Locale locale) {
    return new ResponseEntity<>(service.updateDistrict(baseValidateRequest, locale), HttpStatus.OK);
  }

  // Delete District
  @PostMapping("/delete")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<String> deleteDistrict(
          @Valid @RequestBody String id, Locale locale) {
    service.deleteDistrict(Integer.valueOf(id), locale);
    return ResponseEntity.ok(Constants.SUCCESS);
  }
}
