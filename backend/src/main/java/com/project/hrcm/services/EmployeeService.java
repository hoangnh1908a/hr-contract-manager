package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.Employee;
import com.project.hrcm.models.requests.noRequired.EmployeeRequest;
import com.project.hrcm.repository.EmployeeRepository;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.util.*;
import lombok.AllArgsConstructor;
import io.micrometer.common.util.StringUtils;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmployeeService {

  private final String TABLE_NAME = "EMPLOYEE";

  private final EmployeeRepository employeeRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;

    public static Specification<Employee> filterBy(
            EmployeeRequest employeeRequest
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.isNotBlank(employeeRequest.getFullName())) {
                predicates.add(cb.like(cb.lower(root.get("fullName")), "%" + employeeRequest.getFullName().toLowerCase() + "%"));
            }
            if (StringUtils.isNotBlank(employeeRequest.getNumberId())) {
                predicates.add(cb.like(cb.lower(root.get("numberId")), "%" + employeeRequest.getNumberId().toLowerCase() + "%"));
            }
            if (employeeRequest.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), employeeRequest.getStatus()));
            }
            if (StringUtils.isNotBlank(employeeRequest.getEmail())) {
                predicates.add(cb.like(cb.lower(root.get("email")), "%" + employeeRequest.getEmail().toLowerCase() + "%"));
            }
            if (employeeRequest.getPositionId() != null) {
                predicates.add(cb.equal(root.get("positionId"), employeeRequest.getPositionId()));
            }
            if (employeeRequest.getDepartmentId() != null) {
                predicates.add(cb.equal(root.get("departmentId"), employeeRequest.getDepartmentId()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static void setUpdateEmployee(EmployeeRequest employeeRequest, Employee e) {
        if (StringUtils.isNotBlank(employeeRequest.getFullName()))
            e.setFullName(employeeRequest.getFullName().trim());

        if (StringUtils.isNotBlank(employeeRequest.getNumberId()))
            e.setNumberId(employeeRequest.getNumberId());

        if (StringUtils.isNotBlank(employeeRequest.getDateOfBirth()))
            e.setDateOfBirth(LocalDate.parse(employeeRequest.getDateOfBirth()));

        if (StringUtils.isNotBlank(employeeRequest.getSex()))
            e.setSex(employeeRequest.getSex().trim());

        if (StringUtils.isNotBlank(employeeRequest.getNationality()))
            e.setNationality(employeeRequest.getNationality().trim());

        if (StringUtils.isNotBlank(employeeRequest.getPlaceOfOrigin()))
            e.setPlaceOfOrigin(employeeRequest.getPlaceOfOrigin().trim());

        if (StringUtils.isNotBlank(employeeRequest.getPlaceOfResidence()))
            e.setPlaceOfResidence(employeeRequest.getPlaceOfResidence().trim());

        if (StringUtils.isNotBlank(employeeRequest.getEmail()))
            e.setEmail(employeeRequest.getEmail().trim());

        if (StringUtils.isNotBlank(employeeRequest.getPhone()))
            e.setPhone(employeeRequest.getPhone().trim());

        if (StringUtils.isNotBlank(employeeRequest.getHireDate()))
            e.setHireDate(LocalDate.parse(employeeRequest.getHireDate()));

        if (employeeRequest.getStatus() != null)
            e.setStatus(employeeRequest.getStatus());

        if (StringUtils.isNotBlank(employeeRequest.getDepartmentId()))
            e.setDepartmentId(employeeRequest.getDepartmentId());

        if (StringUtils.isNotBlank(employeeRequest.getPositionId()))
            e.setPositionId(employeeRequest.getPositionId());

        if (employeeRequest.getDepartmentId() != null)
            e.setDepartmentId(employeeRequest.getDepartmentId());

        if (employeeRequest.getPositionId() != null)
            e.setDepartmentId(employeeRequest.getPositionId());
    }

  public Page<Employee> getEmployees(EmployeeRequest employeeRequest, Pageable pageable) {

      Specification<Employee> spec = filterBy(employeeRequest);

      return employeeRepository.findAll(spec, pageable);
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
      if (employeeRepository.existsByEmail(nameRequest.getEmail().trim())) {
          throw new CustomException(
                  Utils.formatMessage(
                          messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NAME_EXISTS));
      }

    Employee employee =
        Employee.builder()
            .fullName(nameRequest.getFullName().trim())
            .numberId(nameRequest.getNumberId())
            .phone(nameRequest.getPhone())
            .dateOfBirth(LocalDate.parse(nameRequest.getDateOfBirth()))
            .sex(nameRequest.getSex().trim())
            .nationality(nameRequest.getNationality().trim())
            .placeOfOrigin(nameRequest.getPlaceOfOrigin().trim())
            .placeOfResidence(nameRequest.getPlaceOfResidence().trim())
            .email(nameRequest.getEmail().trim())
            .hireDate(LocalDate.parse(nameRequest.getHireDate()))
            .status(nameRequest.getStatus())
            .departmentId(nameRequest.getDepartmentId())
            .positionId(nameRequest.getPositionId())
            .build();
    employee = employeeRepository.save(employee);

    auditLogService.saveAuditLog(Constants.ADD, TABLE_NAME, employee.getId(), "", Utils.gson.toJson(employee));
    return employee;
  }

  public Employee updateEmployee(EmployeeRequest employeeRequest, Locale locale) {
    return employeeRepository.findById(employeeRequest.getId()).
        map(
            e -> {
                Employee old = e;

                setUpdateEmployee(employeeRequest, e);

                e = employeeRepository.save(e);

              auditLogService.saveAuditLog(
                  Constants.UPDATE, TABLE_NAME, e.getId(), Utils.gson.toJson(old), Utils.gson.toJson(e));

              return e;
            })
        .orElseThrow(
            () ->
                new CustomException(
                    Utils.formatMessage(
                        messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));
  }

    public void deleteEmployee(Integer id, Locale locale) {
    Optional<Employee> employee = employeeRepository.findById(id);
        employee.ifPresentOrElse(
            employeeRepository::delete,
            () -> {
              throw new CustomException(
                  messageSource.getMessage(
                      TABLE_NAME.toLowerCase() + Constants.NOT_FOUND, null, locale));
            });

    auditLogService.saveAuditLog(Constants.DELETE, TABLE_NAME, id, Utils.gson.toJson(employee.get()), "");
  }
}
