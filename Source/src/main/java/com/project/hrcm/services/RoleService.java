package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.Role;
import com.project.hrcm.models.requests.BaseRequest;
import com.project.hrcm.models.requests.NameRequest;
import com.project.hrcm.repository.RoleRepository;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import java.util.List;
import java.util.Locale;
import lombok.AllArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class RoleService {

  private final String TABLE_NAME = "ROLE";

  private final RoleRepository roleRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;

  public List<Role> getRoles() {
    return roleRepository.findAll();
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

  public Role updateRole(BaseRequest baseRequest, Locale locale) {
    return roleRepository
        .findById(baseRequest.getId())
        .map(
            role -> {
              String oldName = role.getName();
              role.setName(baseRequest.getName());
              role = roleRepository.save(role);

              auditLogService.saveAuditLog(
                  Constants.UPDATE, TABLE_NAME, role.getId(), oldName, baseRequest.getName());

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

  public Role createRole(NameRequest nameRequest, Locale locale) {
    if (roleRepository.existsByName(nameRequest.getName())) {
      throw new CustomException(
          Utils.formatMessage(
              messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NAME_EXISTS));
    }
    Role role = Role.builder().name(nameRequest.getName()).build();
    role = roleRepository.save(role);

    auditLogService.saveAuditLog(Constants.ADD, TABLE_NAME, role.getId(), "", "");
    return role;
  }
}
