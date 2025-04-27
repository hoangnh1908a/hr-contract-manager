package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.Employee;
import com.project.hrcm.models.requests.noRequired.EmployeeRequest;
import com.project.hrcm.models.requests.StatusValidateRequest;
import com.project.hrcm.repository.EmployeeRepository;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import java.util.List;
import java.util.Locale;
import lombok.AllArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmployeeService {

  private final String TABLE_NAME = "EMPLOYEE";

  private final EmployeeRepository employeeRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;

  public Page<Employee> getEmployees(Pageable pageable) {
    return employeeRepository.findAll(pageable);
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

  public Employee createEmployee(EmployeeRequest nameRequest, Locale locale) {
    Employee employee =
        Employee.builder()
            .fullName(nameRequest.getFullName().trim())
            .numberId(nameRequest.getNumberId())
//            .dateOfBirth(nameRequest.getDateOfBirth())
            .sex(nameRequest.getSex().trim())
            .nationality(nameRequest.getNationality().trim())
            .placeOfOrigin(nameRequest.getPlaceOfOrigin().trim())
            .placeOfResidence(nameRequest.getPlaceOfResidence().trim())
            .email(nameRequest.getEmail().trim())
//            .hireDate(nameRequest.getHireDate())
            .status(nameRequest.getStatus())
            .departmentId(nameRequest.getDepartmentId())
            .positionId(nameRequest.getPositionId())
            .build();
    employee = employeeRepository.save(employee);

    auditLogService.saveAuditLog(Constants.ADD, TABLE_NAME, employee.getId(), "", "");
    return employee;
  }

  public Employee updateEmployee(EmployeeRequest employeeRequest, Locale locale) {
    return employeeRepository
        .findById(employeeRequest.getId())
        .map(
            employee -> {
              employee.setFullName(employeeRequest.getFullName().trim());
              employee.setNumberId(employeeRequest.getNumberId());
//              employee.setDateOfBirth(employeeRequest.getDateOfBirth());
              employee.setSex(employeeRequest.getSex().trim());
              employee.setNationality(employeeRequest.getNationality().trim());
              employee.setPlaceOfOrigin(employeeRequest.getPlaceOfOrigin().trim());
              employee.setPlaceOfResidence(employeeRequest.getPlaceOfResidence().trim());
              employee.setEmail(employeeRequest.getEmail().trim());
              employee.setPhone(employeeRequest.getPhone().trim());
//              employee.setHireDate(employeeRequest.getHireDate());
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

  public Employee lockOrUnlockEmployee(StatusValidateRequest employeeRequest, Locale locale) {
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
