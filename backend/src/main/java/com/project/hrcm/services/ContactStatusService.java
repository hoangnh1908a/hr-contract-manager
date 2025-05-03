package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.ContractStatus;
import com.project.hrcm.models.requests.NameValidateRequest;
import com.project.hrcm.models.requests.noRequired.ContractStatusRequest;
import com.project.hrcm.repository.ContractStatusRepository;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import java.util.Locale;
import java.util.Optional;

import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ContactStatusService {

  private final String TABLE_NAME = "CONTACT_STATUS";

  private final ContractStatusRepository contractStatusRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;

  public Page<ContractStatus> getContactStatus(String name, Pageable pageable) {
    return contractStatusRepository.findByNameContainingIgnoreCase(name, pageable);
  }

  public ContractStatus createContactStatus(
          ContractStatusRequest contractStatusRequest, Locale locale) {
    if (contractStatusRepository.existsByName(contractStatusRequest.getName())) {
      throw new CustomException(
          Utils.formatMessage(
              messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NAME_EXISTS));
    }
    ContractStatus contractStatus =
        ContractStatus.builder()
            .name(contractStatusRequest.getName())
            .description(contractStatusRequest.getDescription())
            .build();
    contractStatus = contractStatusRepository.save(contractStatus);

    auditLogService.saveAuditLog(
        Constants.ADD, TABLE_NAME, contractStatus.getId(), "", Utils.gson.toJson(contractStatus));
    return contractStatus;
  }

  public ContractStatus updateContactStatus(
          ContractStatusRequest contractStatusRequest, Locale locale) {
    return contractStatusRepository
        .findById(contractStatusRequest.getId())
        .map(
            contractStatus -> {
              String old = Utils.gson.toJson(contractStatus);
              if (StringUtils.isNotBlank(contractStatusRequest.getName()))
                contractStatus.setName(contractStatusRequest.getName());

              if (StringUtils.isNotBlank(contractStatusRequest.getDescription()))
                contractStatus.setDescription(contractStatusRequest.getDescription());

              contractStatus = contractStatusRepository.save(contractStatus);

              auditLogService.saveAuditLog(
                  Constants.UPDATE,
                  TABLE_NAME,
                  contractStatus.getId(),
                  old,
                  Utils.gson.toJson(contractStatus));

              return contractStatus;
            })
        .orElseThrow(
            () ->
                new CustomException(
                    Utils.formatMessage(
                        messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));
  }

  public void deleteContactStatus(Integer id, Locale locale) {
    Optional<ContractStatus> contractStatus = contractStatusRepository.findById(id);
    contractStatus.ifPresentOrElse(
        contractStatusRepository::delete,
        () -> {
          throw new CustomException(
              Utils.formatMessage(
                  messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND));
        });

    auditLogService.saveAuditLog(
        Constants.DELETE, TABLE_NAME, id, Utils.gson.toJson(contractStatus), "");
  }
}
