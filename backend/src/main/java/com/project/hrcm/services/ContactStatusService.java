package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.ContactStatus;
import com.project.hrcm.models.requests.BaseValidateRequest;
import com.project.hrcm.models.requests.NameValidateRequest;
import com.project.hrcm.repository.ContactStatusRepository;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import java.util.List;
import java.util.Locale;
import lombok.AllArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ContactStatusService {

  private final String TABLE_NAME = "CONTACT_STATUS";

  private final ContactStatusRepository contactStatusRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;

  public List<ContactStatus> getContactStatus() {
    return contactStatusRepository.findAll();
  }

  public ContactStatus getContactStatusById(Integer id, Locale locale) {
    ContactStatus contactStatus =
        contactStatusRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new CustomException(
                        Utils.formatMessage(
                            messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));

    auditLogService.saveAuditLog(Constants.GET_ID, TABLE_NAME, contactStatus.getId(), "", "");

    return contactStatus;
  }

  public ContactStatus createContactStatus(NameValidateRequest nameValidateRequest, Locale locale) {
    if (contactStatusRepository.existsByName(nameValidateRequest.getName())) {
      throw new CustomException(
          Utils.formatMessage(
              messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NAME_EXISTS));
    }
    ContactStatus contactStatus = ContactStatus.builder().name(nameValidateRequest.getName()).build();
    contactStatus = contactStatusRepository.save(contactStatus);

    auditLogService.saveAuditLog(Constants.ADD, TABLE_NAME, contactStatus.getId(), "", "");
    return contactStatus;
  }

  public ContactStatus updateContactStatus(BaseValidateRequest baseValidateRequest, Locale locale) {
    return contactStatusRepository
        .findById(Integer.valueOf(baseValidateRequest.getId()))
        .map(
            contactStatus -> {
              String oldName = contactStatus.getName();
              contactStatus.setName(baseValidateRequest.getName());
              contactStatus = contactStatusRepository.save(contactStatus);

              auditLogService.saveAuditLog(
                  Constants.UPDATE,
                  TABLE_NAME,
                  contactStatus.getId(),
                  oldName,
                  baseValidateRequest.getName());

              return contactStatus;
            })
        .orElseThrow(
            () ->
                new CustomException(
                    Utils.formatMessage(
                        messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));
  }

  public void deleteContactStatus(Integer id, Locale locale) {
    contactStatusRepository
        .findById(id)
        .ifPresentOrElse(
            contactStatusRepository::delete,
            () -> {
              throw new CustomException(
                  Utils.formatMessage(
                      messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND));
            });

    auditLogService.saveAuditLog(Constants.DELETE, TABLE_NAME, id, "", "");
  }
}
