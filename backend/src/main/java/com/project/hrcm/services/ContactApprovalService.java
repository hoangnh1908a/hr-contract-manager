package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.ContactApproval;
import com.project.hrcm.models.requests.ContactApprovalValidateRequest;
import com.project.hrcm.repository.ContactApprovalRepository;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import java.util.List;
import java.util.Locale;
import lombok.AllArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ContactApprovalService {

  private final String TABLE_NAME = "CONTACT_APPROVAL";

  private final ContactApprovalRepository contactApprovalRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;

  public List<ContactApproval> getContactApprovals() {
    return contactApprovalRepository.findAll();
  }

  public ContactApproval getContactApprovalById(Integer id, Locale locale) {
    ContactApproval contactApproval =
        contactApprovalRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new CustomException(
                        Utils.formatMessage(
                            messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));

    auditLogService.saveAuditLog(Constants.GET_ID, TABLE_NAME, contactApproval.getId(), "", "");

    return contactApproval;
  }

    public ContactApproval createContactApproval(
            ContactApprovalValidateRequest contactApprovalValidateRequest, Locale locale) {
        ContactApproval contactApproval = ContactApproval.builder().build();

        contactApproval = contactApprovalRepository.save(contactApproval);

        auditLogService.saveAuditLog(Constants.ADD, TABLE_NAME, contactApproval.getId(), "", "");
        return contactApproval;
    }

  public ContactApproval updateContactApproval(ContactApprovalValidateRequest baseRequest, Locale locale) {
    return contactApprovalRepository
        .findById(baseRequest.getId())
        .map(
            contactApproval -> {
              String oldStatus = contactApproval.getContactStatusId().toString();
              contactApproval.setContactStatusId(baseRequest.getApprovalStatus());
              contactApproval = contactApprovalRepository.save(contactApproval);

              auditLogService.saveAuditLog(
                  Constants.UPDATE,
                  TABLE_NAME,
                  contactApproval.getId(),
                  oldStatus,
                  baseRequest.getApprovalStatus().toString());

              return contactApproval;
            })
        .orElseThrow(
            () ->
                new CustomException(
                    Utils.formatMessage(
                        messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));
  }

  public void deleteContactApproval(Integer id, Locale locale) {
    contactApprovalRepository
        .findById(id)
        .ifPresentOrElse(
            contactApprovalRepository::delete,
            () -> {
              throw new CustomException(
                  Utils.formatMessage(
                      messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND));
            });

    auditLogService.saveAuditLog(Constants.DELETE, TABLE_NAME, id, "", "");
  }
}
