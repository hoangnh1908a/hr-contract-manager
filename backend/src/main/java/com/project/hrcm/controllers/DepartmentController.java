package com.project.hrcm.controllers;

import com.project.hrcm.entities.Department;
import com.project.hrcm.models.requests.BaseValidateRequest;
import com.project.hrcm.models.requests.NameValidateRequest;
import com.project.hrcm.models.requests.StatusValidateRequest;
import com.project.hrcm.services.DepartmentService;
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
@RequestMapping("/department")
public class DepartmentController {

  private final DepartmentService service;

  @GetMapping()
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Page<Department>> getDepartments(Pageable pageable) {
    Page<Department> departments = service.getDepartments(pageable);
    return new ResponseEntity<>(departments, HttpStatus.OK);
  }

  @PostMapping("/get")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Department> getDepartmentById(
          @Valid @RequestBody String id, Locale locale) {
    return new ResponseEntity<>(
        service.getDepartmentById(Integer.valueOf(id), locale), HttpStatus.OK);
  }

  @PostMapping("/create")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Department> createDepartment(
          @Valid @RequestBody NameValidateRequest nameValidateRequest, Locale locale) {
    return new ResponseEntity<>(service.createDepartment(nameValidateRequest, locale), HttpStatus.OK);
  }

  @PostMapping("/update")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Department> updateDepartment(
          @Valid @RequestBody BaseValidateRequest baseValidateRequest, Locale locale) {
    return new ResponseEntity<>(service.updateDepartment(baseValidateRequest, locale), HttpStatus.OK);
  }

  @PostMapping("/delete")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<String> deleteDepartment(
          @Valid @RequestBody String id, Locale locale) {
    service.deleteDepartment(Integer.valueOf(id), locale);
    return ResponseEntity.ok(Constants.SUCCESS);
  }

  @PostMapping("/lock")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Department> lockUser(
          @Valid @RequestBody StatusValidateRequest statusValidateRequest, Locale locale) {

    Department department = service.lockOrUnlockDepartment(statusValidateRequest, locale);

    return new ResponseEntity<>(department, HttpStatus.OK);
  }
}
