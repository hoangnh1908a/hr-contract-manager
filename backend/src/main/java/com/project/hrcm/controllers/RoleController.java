package com.project.hrcm.controllers;

import com.project.hrcm.entities.Role;
import com.project.hrcm.models.requests.BaseValidateRequest;
import com.project.hrcm.models.requests.NameValidateRequest;
import com.project.hrcm.services.RoleService;
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
@RequestMapping("/role")
public class RoleController {

  private final RoleService service;

  @GetMapping()
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Page<Role>> getRoles(@RequestParam(required = false) String name, Pageable pageable, Locale locale) {
    Page<Role> roles = service.getRoles(name, pageable, locale);
    return new ResponseEntity<>(roles, HttpStatus.OK);
  }

  @PostMapping("/get")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Role> getRoleById(@Valid @RequestBody String id, Locale locale) {
    return new ResponseEntity<>(service.getRoleById(Integer.valueOf(id), locale), HttpStatus.OK);
  }

  @PostMapping("/create")
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
  public ResponseEntity<String> deleteRole(@Valid @RequestBody Integer id, Locale locale) {
    service.deleteRole(id, locale);
    return ResponseEntity.ok(Constants.SUCCESS);
  }
}
