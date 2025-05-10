package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.Position;
import com.project.hrcm.models.requests.BaseValidateRequest;
import com.project.hrcm.models.requests.NameValidateRequest;
import com.project.hrcm.repository.PositionRepository;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import java.util.Locale;
import java.util.Optional;

import io.micrometer.core.instrument.binder.system.ProcessorMetrics;
import lombok.AllArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PositionService {

  private final String TABLE_NAME = "POSITION";

  private final PositionRepository positionRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;
    private final ProcessorMetrics processorMetrics;

    public Page<Position> getPositions(String name, Pageable pageable, Locale locale) {
      if (Constants.EN.equalsIgnoreCase(locale.getLanguage())) {
          return positionRepository.findByNameEnContainingIgnoreCase(name, pageable);
      }
    return positionRepository.findByNameContainingIgnoreCase(name, pageable);
  }

  public Position getPositionById(Integer id, Locale locale) {
    Position position =
        positionRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new CustomException(
                        Utils.formatMessage(
                            messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));

    auditLogService.saveAuditLog(Constants.GET_ID, TABLE_NAME, position.getId(), "", "");

    return position;
  }

  public Position createPosition(NameValidateRequest nameValidateRequest, Locale locale) {
    if (positionRepository.existsByName(nameValidateRequest.getName().trim())) {
      throw new CustomException(
          Utils.formatMessage(
              messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NAME_EXISTS));
    }
    Position position = Position.builder()
            .name(nameValidateRequest.getName())
            .nameEn(nameValidateRequest.getNameEn())
            .build();
    position = positionRepository.save(position);

    auditLogService.saveAuditLog(
        Constants.ADD, TABLE_NAME, position.getId(), "", Utils.gson.toJson(position));
    return position;
  }

  public Position updatePosition(BaseValidateRequest baseValidateRequest, Locale locale) {
    return positionRepository
        .findById(Integer.valueOf(baseValidateRequest.getId()))
        .map(
            position -> {
              String old = Utils.gson.toJson(position);
              position.setName(baseValidateRequest.getName());
              position.setNameEn(baseValidateRequest.getNameEn());
              position = positionRepository.save(position);

              auditLogService.saveAuditLog(
                  Constants.UPDATE, TABLE_NAME, position.getId(), old, Utils.gson.toJson(position));

              return position;
            })
        .orElseThrow(
            () ->
                new CustomException(
                    Utils.formatMessage(
                        messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));
  }

  public void deletePosition(Integer id, Locale locale) {
    Optional<Position> position = positionRepository.findById(id);
    position.ifPresentOrElse(
        positionRepository::delete,
        () -> {
          throw new CustomException(
              messageSource.getMessage(
                  TABLE_NAME.toLowerCase() + Constants.NOT_FOUND, null, locale));
        });

    auditLogService.saveAuditLog(Constants.DELETE, TABLE_NAME, id, Utils.gson.toJson(position.get()), "");
  }
}
