package com.project.hrcm.controllers;

import com.project.hrcm.entities.City;
import com.project.hrcm.models.requests.BaseValidateRequest;
import com.project.hrcm.models.requests.IdValidateRequest;
import com.project.hrcm.models.requests.NameValidateRequest;
import com.project.hrcm.models.requests.noRequired.NameRequest;
import com.project.hrcm.services.CityService;
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
@RequestMapping("/city")
public class CityController {

  private final CityService service;

  @GetMapping()
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<List<City>> getCities(@RequestParam NameRequest nameRequest) {
    List<City> cities = service.getCities(nameRequest);
    return new ResponseEntity<>(cities, HttpStatus.OK);
  }

  @PostMapping("/get")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<City> getCityById(@Valid @RequestBody IdValidateRequest idValidateRequest, Locale locale) {
    return new ResponseEntity<>(service.getCityById(idValidateRequest.getId(), locale), HttpStatus.OK);
  }

  @PostMapping("/add")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<City> createCity(
          @Valid @RequestBody NameValidateRequest nameValidateRequest, Locale locale) {
    return new ResponseEntity<>(service.createCity(nameValidateRequest, locale), HttpStatus.OK);
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
  public ResponseEntity<String> deleteCity(@Valid @RequestBody IdValidateRequest idValidateRequest, Locale locale) {
    service.deleteCity(idValidateRequest.getId(), locale);

    return ResponseEntity.ok(Constants.SUCCESS);
  }
}
