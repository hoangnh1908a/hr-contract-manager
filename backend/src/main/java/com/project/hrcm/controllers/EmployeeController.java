package com.project.hrcm.controllers;

import com.project.hrcm.entities.Employee;
import com.project.hrcm.models.requests.*;
import com.project.hrcm.models.requests.noRequired.EmployeeRequest;
import com.project.hrcm.services.EmployeeService;
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
@RequestMapping("/employee")
public class EmployeeController {

  private final EmployeeService service;

  @GetMapping()
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + ", " + Constants.ROLE_HR + "')")
  public ResponseEntity<Page<Employee>> getEmployees(Pageable pageable) {
    Page<Employee> employees = service.getEmployees(pageable);
    return new ResponseEntity<>(employees, HttpStatus.OK);
  }

  @PostMapping("/get")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + ", " + Constants.ROLE_HR + "')")
  public ResponseEntity<Employee> getEmployeeById(
          @Valid @RequestBody String id, Locale locale) {
    return new ResponseEntity<>(service.getEmployeeById(Integer.valueOf(id), locale), HttpStatus.OK);
  }

  @PostMapping("/create")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + ", " + Constants.ROLE_HR + "')")
  public ResponseEntity<Employee> createEmployee(
          @Valid @RequestBody EmployeeRequest employeeRequest, Locale locale) {
    return new ResponseEntity<>(service.createEmployee(employeeRequest, locale), HttpStatus.OK);
  }

  @PostMapping("/update")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + ", " + Constants.ROLE_HR + "')")
  public ResponseEntity<Employee> updateEmployee(
      @Valid @RequestBody EmployeeRequest employeeRequest, Locale locale) {
    return new ResponseEntity<>(service.updateEmployee(employeeRequest, locale), HttpStatus.OK);
  }

  @PostMapping("/delete")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + ", " + Constants.ROLE_HR + "')")
  public ResponseEntity<String> deleteEmployee(
          @Valid @RequestBody String id, Locale locale) {
    service.deleteEmployee(Integer.valueOf(id), locale);
    return ResponseEntity.ok(Constants.SUCCESS);
  }

  @PostMapping("/lock")
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + ", " + Constants.ROLE_HR + "')")
  public ResponseEntity<Employee> lockUser(
          @Valid @RequestBody StatusValidateRequest statusValidateRequest, Locale locale) {

    Employee employee = service.lockOrUnlockEmployee(statusValidateRequest, locale);

    return new ResponseEntity<>(employee, HttpStatus.OK);
  }
}
