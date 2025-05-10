package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.AuditLog;
import com.project.hrcm.entities.Contract;
import com.project.hrcm.entities.ContractApproval;
import com.project.hrcm.models.requests.ContactApprovalValidateRequest;
import com.project.hrcm.models.requests.ContractApprovalRequest;
import com.project.hrcm.models.requests.noRequired.AuditLogRequest;
import com.project.hrcm.repository.ContractApprovalRepository;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import jakarta.persistence.criteria.Predicate;
import lombok.AllArgsConstructor;
import io.micrometer.common.util.StringUtils;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ContactApprovalService {

  private final String TABLE_NAME = "CONTACT_APPROVAL";

  private final ContractApprovalRepository contractApprovalRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;

    public static Specification<ContractApproval> filterBy(ContractApprovalRequest contractApprovalRequest) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();


            if (contractApprovalRequest.getContactId() != null) {
                predicates.add(cb.equal(root.get("contractId"), contractApprovalRequest.getContactId()));
            }
            if (contractApprovalRequest.getFromDate() != null) {
                LocalDateTime from = LocalDateTime.parse(contractApprovalRequest.getFromDate());
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), from));
            }
            if (contractApprovalRequest.getToDate() != null) {
                LocalDateTime to = LocalDateTime.parse(contractApprovalRequest.getToDate());
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), to));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

  public Page<ContractApproval> getContactApprovals(ContractApprovalRequest contractApprovalRequest, Pageable pageable) {
      Specification<ContractApproval> spec = filterBy(contractApprovalRequest);

      return contractApprovalRepository.findAll(spec, pageable);
  }

  public ContractApproval getContactApprovalById(Integer id, Locale locale) {
    ContractApproval contractApproval =
        contractApprovalRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new CustomException(
                        Utils.formatMessage(
                            messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));

    auditLogService.saveAuditLog(Constants.GET_ID, TABLE_NAME, contractApproval.getId(), "", "");

    return contractApproval;
  }

  public ContractApproval createContactApproval(
      ContactApprovalValidateRequest contactApprovalValidateRequest, Locale locale) {
    ContractApproval contractApproval = ContractApproval.builder().build();

    contractApproval = contractApprovalRepository.save(contractApproval);

    auditLogService.saveAuditLog(Constants.ADD, TABLE_NAME, contractApproval.getId(), "", "");
    return contractApproval;
  }

  public ContractApproval updateContactApproval(
      ContactApprovalValidateRequest baseRequest, Locale locale) {
    return contractApprovalRepository
        .findById(baseRequest.getId())
        .map(
            contractApproval -> {
              String oldStatus = contractApproval.getContactStatusId().toString();
              contractApproval.setContactStatusId(baseRequest.getApprovalStatus());
              contractApproval = contractApprovalRepository.save(contractApproval);

              auditLogService.saveAuditLog(
                  Constants.UPDATE,
                  TABLE_NAME,
                  contractApproval.getId(),
                  oldStatus,
                  baseRequest.getApprovalStatus().toString());

              return contractApproval;
            })
        .orElseThrow(
            () ->
                new CustomException(
                    Utils.formatMessage(
                        messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));
  }

  public void deleteContactApproval(Integer id, Locale locale) {
    Optional<ContractApproval> contractApproval = contractApprovalRepository.findById(id);
        contractApproval.ifPresentOrElse(
            contractApprovalRepository::delete,
            () -> {
              throw new CustomException(
                  Utils.formatMessage(
                      messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND));
            });

    auditLogService.saveAuditLog(Constants.DELETE, TABLE_NAME, id, Utils.gson.toJson(contractApproval.get()), "");
  }
}
