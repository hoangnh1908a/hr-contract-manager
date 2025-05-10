package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.Contract;
import com.project.hrcm.models.requests.noRequired.ContractRequest;
import com.project.hrcm.repository.ContractRepository;
import com.project.hrcm.services.userInfo.UserInfoService;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import jakarta.persistence.criteria.Predicate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import lombok.AllArgsConstructor;
import io.micrometer.common.util.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ContractService {

  private final String TABLE_NAME = "CONTRACT";

  private final ContractRepository contractRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;

    public static Specification<Contract> filterBy(ContractRequest contractRequest) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.isNotBlank(contractRequest.getFileName())) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("fileName")),
                                "%" + contractRequest.getFileName().toLowerCase() + "%"));
            }

            if (StringUtils.isNotBlank(contractRequest.getDescription())) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("description")),
                                "%" + contractRequest.getDescription().toLowerCase() + "%"));
            }
            if (StringUtils.isNotBlank(contractRequest.getParams())) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("params")),
                                "%" + contractRequest.getParams().toLowerCase() + "%"));
            }

            if (contractRequest.getFromDate() != null) {
                LocalDateTime from = LocalDateTime.parse(contractRequest.getFromDate());
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), from));
            }

            if (contractRequest.getToDate() != null) {
                LocalDateTime to = LocalDateTime.parse(contractRequest.getToDate());
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), to));
            }

            if (contractRequest.getCreatedBy() != null) {
                predicates.add(cb.equal(root.get("createBy"), contractRequest.getCreatedBy()));
            }

            if (contractRequest.getEmployeeId() != null) {
                predicates.add(cb.equal(root.get("employeeId"), contractRequest.getEmployeeId()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

  public Page<Contract> getContracts(ContractRequest contract, Pageable pageable) {
      Specification<Contract> spec = filterBy(contract);

      return contractRepository.findAll(spec, pageable);
  }

  public Contract createContract(ContractRequest contractRequest, Locale locale) {
    if (contractRepository.existsByFileName(contractRequest.getFileName().trim())) {
      throw new CustomException(
          Utils.formatMessage(
              messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NAME_EXISTS));
    }
    Contract contract = new Contract();

    BeanUtils.copyProperties(contractRequest, contract, "id","createdAt", "updatedAt");

    contract = contractRepository.save(contract);

    auditLogService.saveAuditLog(Constants.ADD, TABLE_NAME, contract.getId(), "", Utils.gson.toJson(contract));
    return contract;
  }

  public Contract updateContract(ContractRequest contractRequest, Locale locale) {
    return contractRepository
        .findById(contractRequest.getId())
        .map(
            contract -> {
              String old = Utils.gson.toJson(contract);

              BeanUtils.copyProperties(contractRequest, contract,"id","createdAt", "updatedAt");

              contract = contractRepository.save(contract);

              auditLogService.saveAuditLog(
                  Constants.UPDATE, TABLE_NAME, contract.getId(), old, Utils.gson.toJson(contract));

              return contract;
            })
        .orElseThrow(
            () ->
                new CustomException(
                    Utils.formatMessage(
                        messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));
  }

  public void deleteContract(Integer id, Locale locale) {
    Optional<Contract> contract = contractRepository.findById(id);

        contract.ifPresentOrElse(
                c -> {
                    String pathFile = c.getFileName();
                },
                () -> {throw new CustomException(
                  Utils.formatMessage(
                      messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND));
            });

    auditLogService.saveAuditLog(Constants.DELETE, TABLE_NAME, id, Utils.gson.toJson(contract.get()), "");
  }
}
