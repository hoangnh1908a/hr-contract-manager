package com.project.hrcm.controllers;

import com.project.hrcm.entities.Department;
import com.project.hrcm.models.requests.BaseRequest;
import com.project.hrcm.models.requests.IdRequest;
import com.project.hrcm.models.requests.NameRequest;
import com.project.hrcm.models.requests.StatusRequest;
import com.project.hrcm.services.DepartmentService;
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
@RequestMapping("/department")
public class DepartmentController {

  private final DepartmentService service;

  @GetMapping()
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<List<Department>> getDepartments() {
    List<Department> departments = service.getDepartments();
    return new ResponseEntity<>(departments, HttpStatus.OK);
  }

  @PostMapping("/get")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Department> getDepartmentById(
      @Valid @RequestBody IdRequest idRequest, Locale locale) {
    return new ResponseEntity<>(
        service.getDepartmentById(idRequest.getId(), locale), HttpStatus.OK);
  }

  @PostMapping("/add")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Department> createDepartment(
      @Valid @RequestBody NameRequest nameRequest, Locale locale) {
    return new ResponseEntity<>(service.createDepartment(nameRequest, locale), HttpStatus.OK);
  }

  @PostMapping("/update")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Department> updateDepartment(
      @Valid @RequestBody BaseRequest baseRequest, Locale locale) {
    return new ResponseEntity<>(service.updateDepartment(baseRequest, locale), HttpStatus.OK);
  }

  @PostMapping("/delete")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<String> deleteDepartment(
      @Valid @RequestBody IdRequest idRequest, Locale locale) {
    service.deleteDepartment(idRequest.getId(), locale);
    return ResponseEntity.ok(Constants.SUCCESS);
  }

  @PostMapping("/lock")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Department> lockUser(
      @Valid @RequestBody StatusRequest statusRequest, Locale locale) {

    Department department = service.lockOrUnlockDepartment(statusRequest, locale);

    return new ResponseEntity<>(department, HttpStatus.OK);
  }
}
