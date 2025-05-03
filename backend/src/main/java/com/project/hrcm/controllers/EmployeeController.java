package com.project.hrcm.controllers;

import com.project.hrcm.entities.Employee;
import com.project.hrcm.models.requests.*;
import com.project.hrcm.models.requests.noRequired.EmployeeRequest;
import com.project.hrcm.services.EmployeeService;
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
@RequestMapping("/employee")
public class EmployeeController {

  private final EmployeeService service;

  @GetMapping()
  @PreAuthorize("hasAnyAuthority(T(com.project.hrcm.utils.Constants).ROLE_ADMIN" +
          ", T(com.project.hrcm.utils.Constants).ROLE_HR)")
  public ResponseEntity<Page<Employee>> getEmployees(EmployeeRequest employeeRequest, Pageable pageable) {
    Page<Employee> employees = service.getEmployees(employeeRequest, pageable);
    return new ResponseEntity<>(employees, HttpStatus.OK);
  }

  @PostMapping("/get")
  @PreAuthorize("hasAnyAuthority(T(com.project.hrcm.utils.Constants).ROLE_ADMIN" +
          ", T(com.project.hrcm.utils.Constants).ROLE_HR)")
  public ResponseEntity<Employee> getEmployeeById(
          @Valid @RequestBody String id, Locale locale) {
    return new ResponseEntity<>(service.getEmployeeById(Integer.valueOf(id), locale), HttpStatus.OK);
  }

  @PostMapping("/create")
  @PreAuthorize("hasAnyAuthority(T(com.project.hrcm.utils.Constants).ROLE_ADMIN" +
          ", T(com.project.hrcm.utils.Constants).ROLE_HR)")
  public ResponseEntity<Employee> createEmployee(
          @Valid @RequestBody EmployeeRequest employeeRequest, Locale locale) {
    return new ResponseEntity<>(service.createEmployee(employeeRequest, locale), HttpStatus.OK);
  }

  @PostMapping("/update")
  @PreAuthorize("hasAnyAuthority(T(com.project.hrcm.utils.Constants).ROLE_ADMIN" +
          ", T(com.project.hrcm.utils.Constants).ROLE_HR)")
  public ResponseEntity<Employee> updateEmployee(
      @Valid @RequestBody EmployeeRequest employeeRequest, Locale locale) {
    return new ResponseEntity<>(service.updateEmployee(employeeRequest, locale), HttpStatus.OK);
  }

  @PostMapping("/delete")
  @PreAuthorize("hasAnyAuthority(T(com.project.hrcm.utils.Constants).ROLE_ADMIN" +
          ", T(com.project.hrcm.utils.Constants).ROLE_HR)")
  public ResponseEntity<String> deleteEmployee(
          @Valid @RequestBody String id, Locale locale) {
    service.deleteEmployee(Integer.valueOf(id), locale);
    return ResponseEntity.ok(Constants.SUCCESS);
  }
}
