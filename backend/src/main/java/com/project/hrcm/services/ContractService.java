package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.Contract;
import com.project.hrcm.entities.Employee;
import com.project.hrcm.models.reponse.CustomContractData;
import com.project.hrcm.models.reponse.DashboardResponseTotal;
import com.project.hrcm.models.reponse.DownloadContractResponse;
import com.project.hrcm.models.requests.noRequired.ContractRequest;
import com.project.hrcm.repository.ContractRepository;
import com.project.hrcm.repository.EmployeeRepository;
import com.project.hrcm.services.userInfo.UserInfoService;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import io.micrometer.common.util.StringUtils;
import jakarta.persistence.criteria.Predicate;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class ContractService {

  private final String TABLE_NAME = "CONTRACT";

  private final ContractRepository contractRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;
  private final DocxService docxService;

  public static Specification<Contract> filterBy(ContractRequest contractRequest) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      if (StringUtils.isNotBlank(contractRequest.getFileName())) {
        predicates.add(
            cb.like(
                cb.lower(root.get("fileName")),
                "%" + contractRequest.getFileName().toLowerCase() + "%"));
      }

      if (StringUtils.isNotBlank(contractRequest.getContractType())) {
        predicates.add(
            cb.like(
                cb.lower(root.get("contractType")),
                "%" + contractRequest.getContractType().toLowerCase() + "%"));
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
    if (contractRepository.existsByFileNameEn(contractRequest.getFileNameEn().trim())) {
      throw new CustomException(
          Utils.formatMessage(
              messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NAME_EXISTS));
    }
    Contract contract = new Contract();

    BeanUtils.copyProperties(contractRequest, contract, "id", "createdAt", "updatedAt");

    // covert to byte
    try {
      String filePath =
          docxService.htmlToDocxBytes(
              contractRequest.getHtmlContract(), contractRequest.getFileName());

      contract.setFilePath(filePath);
      contract.setCreatedBy(UserInfoService.getCurrentUserId());
      // save html -> file docx
    } catch (Exception ex) {
      log.info(" Error save file html : {}", ex.getMessage());
      throw new CustomException(
          Utils.formatMessage(messageSource, locale, TABLE_NAME.toLowerCase(), Constants.ERROR));
    }

    contract = contractRepository.save(contract);

    auditLogService.saveAuditLog(
        Constants.ADD, TABLE_NAME, contract.getId(), "", Utils.gson.toJson(contract));
    return contract;
  }

  public void deleteContract(Integer id, Locale locale) {
    Optional<Contract> contract = contractRepository.findById(id);

    contract.ifPresentOrElse(
        c -> {
//          String pathFile = c.getFilePath();
//          Path path = Paths.get(pathFile).normalize();
//          try {
////            Files.deleteIfExists(path);
//          } catch (IOException e) {
//            log.info(" deleteContract error : {}", e.getMessage());
//            throw new CustomException(
//                Utils.formatMessage(
//                    messageSource, locale, TABLE_NAME.toLowerCase(), Constants.ERROR));
//          }
          c.setContractStatusId(3);
          contractRepository.save(c);
        },
        () -> {
          throw new CustomException(
              Utils.formatMessage(
                  messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND));
        });

    auditLogService.saveAuditLog(
        Constants.DELETE, TABLE_NAME, id, Utils.gson.toJson(contract.get()), "");
  }

  public DownloadContractResponse downloadContract(Integer id, Locale locale) {

    Optional<Contract> contract = contractRepository.findById(id);

    if (contract.isPresent()) {
      Path filePath = Paths.get(contract.get().getFilePath());

      contract.get().setContractStatusId(1); // da gui
      contractRepository.save(contract.get());
      try {
        // Read the file into a byte array
        byte[] data = Files.readAllBytes(filePath);
        // Return the file as a ResponseEntity
        return DownloadContractResponse.builder()
            .fileName(
                Constants.EN.equalsIgnoreCase(locale.getLanguage())
                    ? contract.get().getFileNameEn()
                    : contract.get().getFileName())
            .file(data)
            .build();

      } catch (IOException e) {
        // Log the error and return an appropriate HTTP status
        throw new CustomException(
            Utils.formatMessage(messageSource, locale, TABLE_NAME.toLowerCase(), Constants.ERROR));
      }
    }

    return null;
  }
}
