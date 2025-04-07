package com.project.hrcm.controllers;

import com.project.hrcm.entities.Role;
import com.project.hrcm.models.requests.BaseValidateRequest;
import com.project.hrcm.models.requests.IdValidateRequest;
import com.project.hrcm.models.requests.NameValidateRequest;
import com.project.hrcm.models.requests.noRequired.NameRequest;
import com.project.hrcm.services.RoleService;
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
@RequestMapping("/role")
public class RoleController {

  private final RoleService service;

  @GetMapping()
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<List<Role>> getRoles(@RequestParam NameRequest nameRequest) {
    List<Role> roles = service.getRoles(nameRequest);
    return new ResponseEntity<>(roles, HttpStatus.OK);
  }

  @PostMapping("/get")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Role> getRoleById(@Valid @RequestBody IdValidateRequest idValidateRequest, Locale locale) {
    return new ResponseEntity<>(service.getRoleById(idValidateRequest.getId(), locale), HttpStatus.OK);
  }

  @PostMapping("/add")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Role> createRole(
      Locale locale, @Valid @RequestBody NameValidateRequest nameValidateRequest) {
    return new ResponseEntity<>(service.createRole(nameValidateRequest, locale), HttpStatus.OK);
  }

  // Update Role
  @PostMapping("/update")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Role> updateRole(
          @Valid @RequestBody BaseValidateRequest baseValidateRequest, Locale locale) {
    return new ResponseEntity<>(service.updateRole(baseValidateRequest, locale), HttpStatus.OK);
  }

  // Delete Role
  @PostMapping("/delete")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<String> deleteRole(@Valid @RequestBody IdValidateRequest idValidateRequest, Locale locale) {
    service.deleteRole(idValidateRequest.getId(), locale);
    return ResponseEntity.ok(Constants.SUCCESS);
  }
}
