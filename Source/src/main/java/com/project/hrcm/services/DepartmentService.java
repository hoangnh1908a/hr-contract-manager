package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.Department;
import com.project.hrcm.models.requests.BaseRequest;
import com.project.hrcm.models.requests.NameRequest;
import com.project.hrcm.models.requests.StatusRequest;
import com.project.hrcm.repository.DepartmentRepository;
import com.project.hrcm.utils.Constants;
import java.util.List;
import java.util.Locale;
import lombok.AllArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DepartmentService {

  private final String TABLE_NAME = "DEPARTMENT";
  private final String DEPARTMENT_NOT_FOUND = "department_not_found";
  private final String DEPARTMENT_NAME_EXISTS = "department_name_exists";

  private final DepartmentRepository departmentRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;

  public List<Department> getDepartments() {
    return departmentRepository.findAll();
  }

  public Department getDepartmentById(Integer id, Locale locale) {
    Department department =
        departmentRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new CustomException(
                        messageSource.getMessage(DEPARTMENT_NOT_FOUND, null, locale)));

    auditLogService.saveAuditLog(Constants.GET_ID, TABLE_NAME, department.getId(), "", "");

    return department;
  }

  public Department updateDepartment(BaseRequest baseRequest, Locale locale) {
    return departmentRepository
        .findById(baseRequest.getId())
        .map(
            department -> {
              String oldName = department.getName();
              department.setName(baseRequest.getName());
              department = departmentRepository.save(department);

              auditLogService.saveAuditLog(
                  Constants.UPDATE, TABLE_NAME, department.getId(), oldName, baseRequest.getName());

              return department;
            })
        .orElseThrow(
            () ->
                new CustomException(messageSource.getMessage(DEPARTMENT_NOT_FOUND, null, locale)));
  }

  public void deleteDepartment(Integer id, Locale locale) {
    departmentRepository
        .findById(id)
        .ifPresentOrElse(
            departmentRepository::delete,
            () -> {
              throw new CustomException(
                  messageSource.getMessage(DEPARTMENT_NOT_FOUND, null, locale));
            });

    auditLogService.saveAuditLog(Constants.DELETE, TABLE_NAME, id, "", "");
  }

  public Department createDepartment(NameRequest nameRequest, Locale locale) {
    if (departmentRepository.existsByName(nameRequest.getName())) {
      throw new CustomException(messageSource.getMessage(DEPARTMENT_NAME_EXISTS, null, locale));
    }
    Department department = Department.builder().name(nameRequest.getName()).build();
    department = departmentRepository.save(department);

    auditLogService.saveAuditLog(Constants.ADD, TABLE_NAME, department.getId(), "", "");
    return department;
  }

  public Department lockOrUnlockDepartment(StatusRequest baseRequest, Locale locale) {
    return departmentRepository
        .findById(baseRequest.getId())
        .map(
            department -> {
              String oldStatus = String.valueOf(department.getStatus());
              department.setStatus(baseRequest.getStatus());
              department = departmentRepository.save(department);

              auditLogService.saveAuditLog(
                  Constants.UPDATE,
                  TABLE_NAME,
                  department.getId(),
                  oldStatus,
                  String.valueOf(baseRequest.getStatus()));

              return department;
            })
        .orElseThrow(
            () ->
                new CustomException(messageSource.getMessage(DEPARTMENT_NOT_FOUND, null, locale)));
  }
}
