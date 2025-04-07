package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.Role;
import com.project.hrcm.models.requests.BaseValidateRequest;
import com.project.hrcm.models.requests.NameValidateRequest;
import com.project.hrcm.models.requests.noRequired.NameRequest;
import com.project.hrcm.repository.RoleRepository;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import lombok.AllArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

@Service
@AllArgsConstructor
public class RoleService {

  private final String TABLE_NAME = "ROLE";

  private final RoleRepository roleRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;

  public List<Role> getRoles(NameRequest nameRequest) {
    if (ObjectUtils.isEmpty(nameRequest)) return new ArrayList<>();

    return roleRepository.findByNameLike(nameRequest.getName());
  }

  public Role getRoleById(Integer id, Locale locale) {
    Role role =
        roleRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new CustomException(
                        Utils.formatMessage(
                            messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));

    auditLogService.saveAuditLog(Constants.GET_ID, TABLE_NAME, role.getId(), "", "");

    return role;
  }

  public Role createRole(NameValidateRequest nameValidateRequest, Locale locale) {
    if (roleRepository.existsByName(nameValidateRequest.getName())) {
      throw new CustomException(
          Utils.formatMessage(
              messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NAME_EXISTS));
    }
    Role role = Role.builder().name(nameValidateRequest.getName()).build();
    role = roleRepository.save(role);

    auditLogService.saveAuditLog(Constants.ADD, TABLE_NAME, role.getId(), "", "");
    return role;
  }

  public Role updateRole(BaseValidateRequest baseValidateRequest, Locale locale) {
    return roleRepository
        .findById(baseValidateRequest.getId())
        .map(
            role -> {
              String oldName = role.getName();
              role.setName(baseValidateRequest.getName());
              role = roleRepository.save(role);

              auditLogService.saveAuditLog(
                  Constants.UPDATE, TABLE_NAME, role.getId(), oldName, baseValidateRequest.getName());

              return role;
            })
        .orElseThrow(
            () ->
                new CustomException(
                    Utils.formatMessage(
                        messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));
  }

  public void deleteRole(Integer id, Locale locale) {
    roleRepository
        .findById(id)
        .ifPresentOrElse(
            roleRepository::delete,
            () -> {
              throw new CustomException(
                  Utils.formatMessage(
                      messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND));
            });

    auditLogService.saveAuditLog(Constants.DELETE, TABLE_NAME, id, "", "");
  }
}
