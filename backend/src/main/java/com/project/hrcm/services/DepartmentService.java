package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.Department;
import com.project.hrcm.models.requests.BaseValidateRequest;
import com.project.hrcm.models.requests.NameValidateRequest;
import com.project.hrcm.repository.DepartmentRepository;
import com.project.hrcm.services.userInfo.UserInfoService;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import io.micrometer.common.util.StringUtils;
import java.util.Locale;
import java.util.Optional;
import lombok.AllArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DepartmentService {

  private final String TABLE_NAME = "DEPARTMENT";

  private final DepartmentRepository departmentRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;

  public Page<Department> getDepartments(String name, Pageable pageable, Locale locale) {
    if (Constants.EN.equalsIgnoreCase(locale.getLanguage())) {
      return departmentRepository.findByNameEnContainingIgnoreCase(name, pageable);
    }
    return departmentRepository.findByNameContainingIgnoreCase(name, pageable);
  }

  public Department getDepartmentById(Integer id, Locale locale) {
    Department department =
        departmentRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new CustomException(
                        Utils.formatMessage(
                            messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));

    auditLogService.saveAuditLog(Constants.GET_ID, TABLE_NAME, department.getId(), "", "");

    return department;
  }

  public Department createDepartment(NameValidateRequest nameValidateRequest, Locale locale) {
    if (departmentRepository.existsByName(nameValidateRequest.getName().trim())) {
      throw new CustomException(
          Utils.formatMessage(
              messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NAME_EXISTS));
    }
    Department department =
        Department.builder()
            .name(nameValidateRequest.getName().trim())
            .nameEn(nameValidateRequest.getNameEn().trim())
            .createdBy(UserInfoService.getCurrentUserId())
            .status(nameValidateRequest.getStatus())
            .build();
    department = departmentRepository.save(department);

    auditLogService.saveAuditLog(Constants.ADD, TABLE_NAME, department.getId(), "", "");
    return department;
  }

  public Department updateDepartment(BaseValidateRequest baseValidateRequest, Locale locale) {
    return departmentRepository
        .findById(Integer.valueOf(baseValidateRequest.getId()))
        .map(
            department -> {
              String old = Utils.gson.toJson(department);
              if (StringUtils.isNotBlank(baseValidateRequest.getName()))
                department.setName(baseValidateRequest.getName().trim());

              if (StringUtils.isNotBlank(baseValidateRequest.getNameEn()))
                department.setNameEn(baseValidateRequest.getNameEn().trim());

              if (baseValidateRequest.getStatus() != null)
                department.setStatus(baseValidateRequest.getStatus());
              department.setUpdatedBy(UserInfoService.getCurrentUserId());
              department = departmentRepository.save(department);

              auditLogService.saveAuditLog(
                  Constants.UPDATE,
                  TABLE_NAME,
                  department.getId(),
                  old,
                  baseValidateRequest.getName());

              return department;
            })
        .orElseThrow(
            () ->
                new CustomException(
                    Utils.formatMessage(
                        messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));
  }

  public void deleteDepartment(Integer id, Locale locale) {
    Optional<Department> department = departmentRepository.findById(id);
    department.ifPresentOrElse(
        departmentRepository::delete,
        () -> {
          throw new CustomException(
              messageSource.getMessage(
                  TABLE_NAME.toLowerCase() + Constants.NOT_FOUND, null, locale));
        });

    auditLogService.saveAuditLog(
        Constants.DELETE, TABLE_NAME, id, Utils.gson.toJson(department.get()), "");
  }
}
