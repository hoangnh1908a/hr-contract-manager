package com.project.hrcm.controllers;

import com.project.hrcm.entities.District;
import com.project.hrcm.models.requests.BaseValidateRequest;
import com.project.hrcm.models.requests.NameValidateRequest;
import com.project.hrcm.models.requests.noRequired.DistrictRequest;
import com.project.hrcm.services.DistrictService;
import com.project.hrcm.utils.Constants;
import jakarta.validation.Valid;
import java.util.List;
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
@RequestMapping("/district")
public class DistrictController {

  private final DistrictService service;

  @GetMapping()
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Page<District>> getDistricts(@RequestParam(required = false) DistrictRequest district, Pageable pageable) {
    Page<District> districts = service.getDistricts(district, pageable);
    return new ResponseEntity<>(districts, HttpStatus.OK);
  }

  @PostMapping("/get")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<District> getDistrictById(
          @Valid @RequestBody String id, Locale locale) {
    return new ResponseEntity<>(service.getDistrictById(Integer.valueOf(id), locale), HttpStatus.OK);
  }

  @PostMapping("/create")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<District> createDistrict(
          @Valid @RequestBody DistrictRequest districtRequest, Locale locale) {
    return new ResponseEntity<>(service.createDistrict(districtRequest, locale), HttpStatus.OK);
  }

  // Update District
  @PostMapping("/update")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<District> updateDistrict(
          @Valid @RequestBody DistrictRequest districtRequest, Locale locale) {
    return new ResponseEntity<>(service.updateDistrict(districtRequest, locale), HttpStatus.OK);
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
