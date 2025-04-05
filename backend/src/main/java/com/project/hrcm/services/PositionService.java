package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.Position;
import com.project.hrcm.models.requests.BaseRequest;
import com.project.hrcm.models.requests.NameRequest;
import com.project.hrcm.models.requests.StatusRequest;
import com.project.hrcm.repository.PositionRepository;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import java.util.List;
import java.util.Locale;
import lombok.AllArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PositionService {

  private final String TABLE_NAME = "POSITION";

  private final PositionRepository positionRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;

  public List<Position> getPositions() {
    return positionRepository.findAll();
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

  public Position updatePosition(BaseRequest baseRequest, Locale locale) {
    return positionRepository
        .findById(baseRequest.getId())
        .map(
            position -> {
              String oldName = position.getName();
              position.setName(baseRequest.getName());
              position = positionRepository.save(position);

              auditLogService.saveAuditLog(
                  Constants.UPDATE, TABLE_NAME, position.getId(), oldName, baseRequest.getName());

              return position;
            })
        .orElseThrow(
            () ->
                new CustomException(
                    Utils.formatMessage(
                        messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));
  }

  public void deletePosition(Integer id, Locale locale) {
    positionRepository
        .findById(id)
        .ifPresentOrElse(
            positionRepository::delete,
            () -> {
              throw new CustomException(
                  messageSource.getMessage(
                      TABLE_NAME.toLowerCase() + Constants.NOT_FOUND, null, locale));
            });

    auditLogService.saveAuditLog(Constants.DELETE, TABLE_NAME, id, "", "");
  }

  public Position createPosition(NameRequest nameRequest, Locale locale) {
    if (positionRepository.existsByName(nameRequest.getName())) {
      throw new CustomException(
          Utils.formatMessage(
              messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NAME_EXISTS));
    }
    Position position = Position.builder().name(nameRequest.getName()).build();
    position = positionRepository.save(position);

    auditLogService.saveAuditLog(Constants.ADD, TABLE_NAME, position.getId(), "", "");
    return position;
  }

  public Position lockOrUnlockPosition(StatusRequest baseRequest, Locale locale) {
    return positionRepository
        .findById(baseRequest.getId())
        .map(
            position -> {
              String oldStatus = String.valueOf(position.getStatus());
              position.setStatus(baseRequest.getStatus());
              position = positionRepository.save(position);

              auditLogService.saveAuditLog(
                  Constants.UPDATE,
                  TABLE_NAME,
                  position.getId(),
                  oldStatus,
                  String.valueOf(baseRequest.getStatus()));

              return position;
            })
        .orElseThrow(
            () ->
                new CustomException(
                    Utils.formatMessage(
                        messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));
  }
}
