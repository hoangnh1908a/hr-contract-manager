package com.project.hrcm.controllers;

import com.project.hrcm.entities.City;
import com.project.hrcm.entities.City;
import com.project.hrcm.models.requests.BaseRequest;
import com.project.hrcm.models.requests.IdRequest;
import com.project.hrcm.models.requests.NameRequest;
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
  public ResponseEntity<List<City>> getCitys() {
    List<City> citys = service.getCitys();
    return new ResponseEntity<>(citys, HttpStatus.OK);
  }

  @PostMapping("/add")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<City> createUser(@Valid @RequestBody NameRequest nameRequest, Locale locale) {
    return new ResponseEntity<>(service.createCity(nameRequest, locale), HttpStatus.OK);
  }

  @PostMapping("/get")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<City> getCityById(@Valid @RequestBody IdRequest idRequest, Locale locale) {
    return new ResponseEntity<>(service.getCityById(idRequest.getId(), locale), HttpStatus.OK);
  }

  // Update City
  @PostMapping("/update")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<City> updateCity(@Valid @RequestBody BaseRequest baseRequest, Locale locale) {
    return new ResponseEntity<>(service.updateCity(baseRequest, locale), HttpStatus.OK);
  }

  // Delete City
  @PostMapping("/delete")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<String> deleteCity(@Valid @RequestBody IdRequest idRequest, Locale locale) {
    service.deleteCity(idRequest.getId(), locale);
    return ResponseEntity.ok(Constants.SUCCESS);
  }
}
