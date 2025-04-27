package com.project.hrcm.controllers;

import com.project.hrcm.entities.City;
import com.project.hrcm.models.requests.BaseValidateRequest;
import com.project.hrcm.models.requests.noRequired.NameRequest;
import com.project.hrcm.services.CityService;
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
@RequestMapping("/city")
public class CityController {

  private final CityService service;

  @GetMapping()
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Page<City>> getCities(@RequestParam(required = false) String name, Pageable pageable) {
    Page<City> cities = service.getCities(name, pageable);
    return new ResponseEntity<>(cities, HttpStatus.OK);
  }

  @PostMapping("/get")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<City> getCityById(@Valid @RequestBody String id, Locale locale) {
    return new ResponseEntity<>(service.getCityById(Integer.valueOf(id), locale), HttpStatus.OK);
  }

  @PostMapping("/create")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<City> createCity(
          @Valid @RequestBody NameRequest nameRequest, Locale locale) {
    return new ResponseEntity<>(service.createCity(nameRequest.getName(), locale), HttpStatus.OK);
  }

  // Update City
  @PostMapping("/update")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<City> updateCity(
          @Valid @RequestBody BaseValidateRequest baseValidateRequest, Locale locale) {
    return new ResponseEntity<>(service.updateCity(baseValidateRequest, locale), HttpStatus.OK);
  }

  // Delete City
  @PostMapping("/delete")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<String> deleteCity(@Valid @RequestBody String id, Locale locale) {
    service.deleteCity(Integer.valueOf(id), locale);

    return ResponseEntity.ok(Constants.SUCCESS);
  }
}
