package com.project.hrcm.controllers;

import com.project.hrcm.entities.Config;
import com.project.hrcm.models.requests.noRequired.ConfigRequest;
import com.project.hrcm.models.requests.noRequired.ConfigsRequest;
import com.project.hrcm.services.ConfigService;
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
@RequestMapping("/config")
public class ConfigController {

  private final ConfigService service;

  @GetMapping()
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Page<Config>> getConfig(
      ConfigRequest configRequest, Pageable pageable, Locale locale) {
    Page<Config> config = service.getConfig(configRequest, pageable, locale);
    return new ResponseEntity<>(config, HttpStatus.OK);
  }

  @PostMapping("/create")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Config> createConfig(
      @Valid @RequestBody ConfigsRequest configsRequest, Locale locale) {
    return new ResponseEntity<>(service.createConfig(configsRequest, locale), HttpStatus.OK);
  }

  // Update Config
  @PostMapping("/update")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Config> updateConfig(
      @Valid @RequestBody ConfigsRequest configsRequest, Locale locale) {
    return new ResponseEntity<>(service.updateConfig(configsRequest, locale), HttpStatus.OK);
  }

  // Delete Config
  @PostMapping("/delete")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<String> deleteConfig(@Valid @RequestBody String id, Locale locale) {
    service.deleteConfig(Integer.valueOf(id), locale);

    return ResponseEntity.ok(Constants.SUCCESS);
  }
}
