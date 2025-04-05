package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.Employee;
import com.project.hrcm.models.requests.EmployeeRequest;
import com.project.hrcm.models.requests.StatusRequest;
import com.project.hrcm.repository.EmployeeRepository;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import java.util.List;
import java.util.Locale;
import lombok.AllArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmployeeService {

  private final String TABLE_NAME = "EMPLOYEE";

  private final EmployeeRepository employeeRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;

  public List<Employee> getEmployees() {
    return employeeRepository.findAll();
  }

  public Employee getEmployeeById(Integer id, Locale locale) {
    Employee employee =
        employeeRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new CustomException(
                        Utils.formatMessage(
                            messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));

    auditLogService.saveAuditLog(Constants.GET_ID, TABLE_NAME, employee.getId(), "", "");

    return employee;
  }

  public Employee updateEmployee(EmployeeRequest employeeRequest, Locale locale) {
    return employeeRepository
        .findById(employeeRequest.getId())
        .map(
            employee -> {
              employee.setFullName(employeeRequest.getFullName());
              employee.setNumberId(employeeRequest.getNumberId());
              employee.setDateOfBirth(employeeRequest.getDateOfBirth());
              employee.setSex(employeeRequest.getSex());
              employee.setNationality(employeeRequest.getNationality());
              employee.setPlaceOfOrigin(employeeRequest.getPlaceOfOrigin());
              employee.setPlaceOfResidence(employeeRequest.getPlaceOfResidence());
              employee.setEmail(employeeRequest.getEmail());
              employee.setPhone(employeeRequest.getPhone());
              employee.setHireDate(employeeRequest.getHireDate());
              employee.setStatus(employeeRequest.getStatus());
              employee.setDepartmentId(employeeRequest.getDepartmentId());
              employee.setPositionId(employeeRequest.getPositionId());

              employee = employeeRepository.save(employee);

              auditLogService.saveAuditLog(
                  Constants.UPDATE, TABLE_NAME, employee.getId(), "", employeeRequest.getEmail());

              return employee;
            })
        .orElseThrow(
            () ->
                new CustomException(
                    Utils.formatMessage(
                        messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));
  }

  public void deleteEmployee(Integer id, Locale locale) {
    employeeRepository
        .findById(id)
        .ifPresentOrElse(
            employeeRepository::delete,
            () -> {
              throw new CustomException(
                  messageSource.getMessage(
                      TABLE_NAME.toLowerCase() + Constants.NOT_FOUND, null, locale));
            });

    auditLogService.saveAuditLog(Constants.DELETE, TABLE_NAME, id, "", "");
  }

  public Employee createEmployee(EmployeeRequest nameRequest, Locale locale) {
    Employee employee =
        Employee.builder()
            .fullName(nameRequest.getFullName())
            .numberId(nameRequest.getNumberId())
            .dateOfBirth(nameRequest.getDateOfBirth())
            .sex(nameRequest.getSex())
            .nationality(nameRequest.getNationality())
            .placeOfOrigin(nameRequest.getPlaceOfOrigin())
            .placeOfResidence(nameRequest.getPlaceOfResidence())
            .email(nameRequest.getEmail())
            .hireDate(nameRequest.getHireDate())
            .status(nameRequest.getStatus())
            .departmentId(nameRequest.getDepartmentId())
            .positionId(nameRequest.getPositionId())
            .build();
    employee = employeeRepository.save(employee);

    auditLogService.saveAuditLog(Constants.ADD, TABLE_NAME, employee.getId(), "", "");
    return employee;
  }

  public Employee lockOrUnlockEmployee(StatusRequest employeeRequest, Locale locale) {
    return employeeRepository
        .findById(employeeRequest.getId())
        .map(
            employee -> {
              String oldStatus = String.valueOf(employee.getStatus());
              employee.setStatus(employeeRequest.getStatus());
              employee = employeeRepository.save(employee);

              auditLogService.saveAuditLog(
                  Constants.UPDATE,
                  TABLE_NAME,
                  employee.getId(),
                  oldStatus,
                  String.valueOf(employeeRequest.getStatus()));

              return employee;
            })
        .orElseThrow(
            () ->
                new CustomException(
                    Utils.formatMessage(
                        messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));
  }
}
