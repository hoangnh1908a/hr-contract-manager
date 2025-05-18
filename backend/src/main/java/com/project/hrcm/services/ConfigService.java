package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.Config;
import com.project.hrcm.models.requests.noRequired.ConfigRequest;
import com.project.hrcm.models.requests.noRequired.ConfigsRequest;
import com.project.hrcm.repository.ConfigRepository;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import io.micrometer.common.util.StringUtils;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import lombok.AllArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ConfigService {

  private final String TABLE_NAME = "CONFIG";

  private final ConfigRepository configRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;

  public static Specification<Config> filterBy(ConfigRequest configRequest, Locale locale) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      if (StringUtils.isNotBlank(configRequest.getCode())) {
        predicates.add(
            cb.like(cb.lower(root.get("code")), "%" + configRequest.getCode().toLowerCase() + "%"));
      }
      if (StringUtils.isNotBlank(configRequest.getType())) {
        predicates.add(
            cb.like(cb.lower(root.get("type")), "%" + configRequest.getType().toLowerCase() + "%"));
      }
      if (StringUtils.isNotBlank(configRequest.getName())) {
        if (Constants.EN.equalsIgnoreCase(locale.getLanguage())) {
          predicates.add(
              cb.like(
                  cb.lower(root.get("name")), "%" + configRequest.getName().toLowerCase() + "%"));
        } else {
          predicates.add(
              cb.like(
                  cb.lower(root.get("nameEn")), "%" + configRequest.getName().toLowerCase() + "%"));
        }
      }
      if (StringUtils.isNotBlank(configRequest.getDescription())) {
        predicates.add(
            cb.like(
                cb.lower(root.get("description")),
                "%" + configRequest.getDescription().toLowerCase() + "%"));
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  public Page<Config> getConfig(ConfigRequest configRequest, Pageable pageable, Locale locale) {
    Specification<Config> spec = filterBy(configRequest, locale);

    return configRepository.findAll(spec, pageable);
  }

  public Config createConfig(ConfigsRequest configsRequest, Locale locale) {
    Config config =
        Config.builder()
            .type(configsRequest.getType())
            .code(configsRequest.getCode())
            .name(configsRequest.getName())
            .nameEn(configsRequest.getNameEn())
            .description(configsRequest.getDescription())
            .build();
    config = configRepository.save(config);

    auditLogService.saveAuditLog(
        Constants.ADD, TABLE_NAME, config.getId(), "", Utils.gson.toJson(config));
    return config;
  }

  public Config updateConfig(ConfigsRequest configsRequest, Locale locale) {
    return configRepository
        .findById(configsRequest.getId())
        .map(
            config -> {
              String old = Utils.gson.toJson(config);

              if (StringUtils.isNotBlank(configsRequest.getType()))
                config.setType(configsRequest.getType());

              if (StringUtils.isNotBlank(configsRequest.getCode()))
                config.setCode(configsRequest.getCode());

              if (StringUtils.isNotBlank(configsRequest.getName()))
                config.setName(configsRequest.getName());

              if (StringUtils.isNotBlank(configsRequest.getNameEn()))
                config.setNameEn(configsRequest.getNameEn());

              if (StringUtils.isNotBlank(configsRequest.getDescription()))
                config.setDescription(configsRequest.getDescription());

              config = configRepository.save(config);

              auditLogService.saveAuditLog(
                  Constants.UPDATE, TABLE_NAME, config.getId(), old, Utils.gson.toJson(config));

              return config;
            })
        .orElseThrow(
            () ->
                new CustomException(
                    Utils.formatMessage(
                        messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));
  }

  public void deleteConfig(Integer id, Locale locale) {
    Optional<Config> config = configRepository.findById(id);
    config.ifPresentOrElse(
        configRepository::delete,
        () -> {
          throw new CustomException(
              Utils.formatMessage(
                  messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND));
        });

    auditLogService.saveAuditLog(
        Constants.DELETE, TABLE_NAME, id, Utils.gson.toJson(config.get()), "");
  }
}
