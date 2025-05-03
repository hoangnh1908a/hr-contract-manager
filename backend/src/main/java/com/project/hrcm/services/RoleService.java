package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.Role;
import com.project.hrcm.models.requests.BaseValidateRequest;
import com.project.hrcm.models.requests.NameValidateRequest;
import com.project.hrcm.repository.RoleRepository;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import java.util.Locale;
import java.util.Optional;
import lombok.AllArgsConstructor;
import org.apache.poi.util.StringUtil;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class RoleService {

  private final String TABLE_NAME = "ROLE";

  private final RoleRepository roleRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;

  public Page<Role> getRoles(String name, Pageable pageable) {
    return roleRepository.findByNameContainingIgnoreCase(name, pageable);
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
    if (roleRepository.existsByName(nameValidateRequest.getName().trim())) {
      throw new CustomException(
          Utils.formatMessage(
              messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NAME_EXISTS));
    }

    Role role =
        Role.builder()
            .name(nameValidateRequest.getName().trim())
            .status(nameValidateRequest.getStatus())
            .build();

    role = roleRepository.save(role);

    auditLogService.saveAuditLog(Constants.ADD, TABLE_NAME, role.getId(), "", "");
    return role;
  }

  public Role updateRole(BaseValidateRequest baseValidateRequest, Locale locale) {
    return roleRepository
        .findById(Integer.valueOf(baseValidateRequest.getId()))
        .map(
            role -> {
              String old = Utils.gson.toJson(role);

              if (StringUtil.isNotBlank(baseValidateRequest.getName()))
                role.setName(baseValidateRequest.getName().trim());

              if (baseValidateRequest.getStatus() != null)
                role.setStatus(baseValidateRequest.getStatus());

              role = roleRepository.save(role);

              auditLogService.saveAuditLog(
                  Constants.UPDATE, TABLE_NAME, role.getId(), old, Utils.gson.toJson(role));

              return role;
            })
        .orElseThrow(
            () ->
                new CustomException(
                    Utils.formatMessage(
                        messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));
  }

  public void deleteRole(Integer id, Locale locale) {
    Optional<Role> role = roleRepository.findById(id);
    role.ifPresentOrElse(
        roleRepository::delete,
        () -> {
          throw new CustomException(
              Utils.formatMessage(
                  messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND));
        });

    auditLogService.saveAuditLog(Constants.DELETE, TABLE_NAME, id, Utils.gson.toJson(role), "");
  }
}
