package com.project.hrcm.controllers;

import com.project.hrcm.entities.Role;
import com.project.hrcm.models.requests.BaseRequest;
import com.project.hrcm.models.requests.IdRequest;
import com.project.hrcm.models.requests.NameRequest;
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
  public ResponseEntity<List<Role>> getRoles() {
    List<Role> roles = service.getRoles();
    return new ResponseEntity<>(roles, HttpStatus.OK);
  }

  @PostMapping("/get")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Role> getRoleById(@Valid @RequestBody IdRequest idRequest, Locale locale) {
    return new ResponseEntity<>(service.getRoleById(idRequest.getId(), locale), HttpStatus.OK);
  }

  @PostMapping("/add")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Role> createRole(
      Locale locale, @Valid @RequestBody NameRequest nameRequest) {
    return new ResponseEntity<>(service.createRole(nameRequest, locale), HttpStatus.OK);
  }

  // Update Role
  @PostMapping("/update")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Role> updateRole(
      @Valid @RequestBody BaseRequest baseRequest, Locale locale) {
    return new ResponseEntity<>(service.updateRole(baseRequest, locale), HttpStatus.OK);
  }

  // Delete Role
  @PostMapping("/delete")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<String> deleteRole(@Valid @RequestBody IdRequest idRequest, Locale locale) {
    service.deleteRole(idRequest.getId(), locale);
    return ResponseEntity.ok(Constants.SUCCESS);
  }
}
