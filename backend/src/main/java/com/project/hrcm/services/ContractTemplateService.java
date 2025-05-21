package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.ContractTemplate;
import com.project.hrcm.models.requests.noRequired.ContactTemplateRequest;
import com.project.hrcm.repository.ContractTemplateRepository;
import com.project.hrcm.services.userInfo.UserInfoService;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import jakarta.persistence.criteria.Predicate;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import lombok.AllArgsConstructor;
import io.micrometer.common.util.StringUtils;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@AllArgsConstructor
public class ContractTemplateService {

  private final String TABLE_NAME = "CONTACT_TEMPLATE";

  private final ContractTemplateRepository contractStatusRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;
  private final DocxService docxService;

  public static Specification<ContractTemplate> filterBy(
      ContactTemplateRequest contactTemplateRequest) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      if (StringUtils.isNotBlank(contactTemplateRequest.getFileName())) {
        predicates.add(
            cb.like(
                cb.lower(root.get("fileName")),
                "%" + contactTemplateRequest.getFileName().toLowerCase() + "%"));
      }
      if (StringUtils.isNotBlank(contactTemplateRequest.getParams())) {
        predicates.add(
            cb.like(
                cb.lower(root.get("params")),
                "%" + contactTemplateRequest.getParams().toLowerCase() + "%"));
      }
      if (StringUtils.isNotBlank(contactTemplateRequest.getDescription())) {
        predicates.add(
            cb.like(
                cb.lower(root.get("description")),
                "%" + contactTemplateRequest.getDescription().toLowerCase() + "%"));
      }
      if (contactTemplateRequest.getStatus() != null) {
        predicates.add(cb.equal(root.get("status"), contactTemplateRequest.getStatus()));
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  public Page<ContractTemplate> getContactTemplate(
      ContactTemplateRequest contactTemplateRequest, Pageable pageable) {

    Specification<ContractTemplate> spec = filterBy(contactTemplateRequest);

    return contractStatusRepository.findAll(spec, pageable);
  }

  public ContractTemplate createContactTemplate(
      MultipartFile file,
      String fileName,
      String fileNameEn,
      String description,
      Integer status,
      Locale locale)
      throws Exception {
    if (contractStatusRepository.existsByFileName(fileName)) {
      throw new CustomException(
          Utils.formatMessage(
              messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NAME_EXISTS));
    }

    ContractTemplate contractTemplate =
        ContractTemplate.builder()
            .fileName(fileName.trim())
            .fileNameEn(fileNameEn.trim())
            .description(description.trim())
            .status(status)
            .createdBy(UserInfoService.getCurrentUserId())
            .build();

    docxService.saveDocx(file, contractTemplate);

    contractTemplate = contractStatusRepository.save(contractTemplate);

    auditLogService.saveAuditLog(
        Constants.ADD,
        TABLE_NAME,
        contractTemplate.getId(),
        "",
        Utils.gson.toJson(contractTemplate));
    return contractTemplate;
  }

  public ContractTemplate updateContractTemplate(
      MultipartFile file,
      String fileName,
      String fileNameEn,
      String description,
      Integer status,
      Locale locale) {
    return contractStatusRepository
        .findByFileName(fileName)
        .map(
            contractTemplate -> {
              String oldName = Utils.gson.toJson(contractTemplate);

              if (StringUtils.isNotBlank(fileName)) contractTemplate.setFileName(fileName.trim());

              if (StringUtils.isNotBlank(fileNameEn))
                contractTemplate.setFileName(fileNameEn.trim());

              if (StringUtils.isNotBlank(description)) contractTemplate.setDescription(description);
              if (status != null) contractTemplate.setStatus(status);

              contractTemplate.setCreatedBy(UserInfoService.getCurrentUserId());

              if (file != null) {
                try {
                  docxService.saveDocx(file, contractTemplate);
                } catch (IOException e) {
                  throw new RuntimeException(e);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
              }

              contractTemplate = contractStatusRepository.save(contractTemplate);

              auditLogService.saveAuditLog(
                  Constants.UPDATE,
                  TABLE_NAME,
                  contractTemplate.getId(),
                  oldName,
                  Utils.gson.toJson(contractTemplate));

              return contractTemplate;
            })
        .orElseThrow(
            () ->
                new CustomException(
                    Utils.formatMessage(
                        messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));
  }

    public void deleteContactTemplate(Integer id, Locale locale) {
        Optional<ContractTemplate> contractTemplate = contractStatusRepository.findById(id); // Changed variable name to contractTemplate

        contractTemplate.ifPresentOrElse(
                template -> { // Added explicit lambda parameter name
                    contractStatusRepository.delete(template);
                    try {
                        Files.deleteIfExists(Paths.get(template.getFilePath()).normalize());
                        String pathHtml = template.getFilePath().replace(".docx", ".html");
                        Files.deleteIfExists(Paths.get(pathHtml).normalize());
                    } catch (IOException e) {
                        // Handle the exception appropriately (see suggestion below)
                        throw new CustomException(
                                Utils.formatMessage(messageSource, locale, TABLE_NAME.toLowerCase(), "FILE_DELETE_FAILED")); //Added a new message for file deletion failure
                    }
                },
                () -> {
                    throw new CustomException(
                            Utils.formatMessage(
                                    messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND));
                });

        //Added null check
        contractTemplate.ifPresent(template -> auditLogService.saveAuditLog(
                Constants.DELETE, TABLE_NAME, id, Utils.gson.toJson(template), ""));
    }
}
