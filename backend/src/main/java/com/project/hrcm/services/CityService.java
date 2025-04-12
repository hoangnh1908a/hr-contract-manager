package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.City;
import com.project.hrcm.models.requests.BaseValidateRequest;
import com.project.hrcm.models.requests.NameValidateRequest;
import com.project.hrcm.models.requests.noRequired.NameRequest;
import com.project.hrcm.repository.CityRepository;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import java.util.List;
import java.util.Locale;

import lombok.AllArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CityService {

  private final String TABLE_NAME = "CITY";

  private final CityRepository cityRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;

  public List<City> getCities(NameRequest nameRequest) {
      return cityRepository.findByName(nameRequest.getName());
  }

  public City getCityById(Integer id, Locale locale) {
    City city =
        cityRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new CustomException(
                        Utils.formatMessage(
                            messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));

    auditLogService.saveAuditLog(Constants.GET_ID, TABLE_NAME, city.getId(), "", "");

    return city;
  }

  public City createCity(NameValidateRequest nameValidateRequest, Locale locale) {
    if (cityRepository.existsByName(nameValidateRequest.getName())) {
      throw new CustomException(
          Utils.formatMessage(
              messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NAME_EXISTS));
    }
    City city = City.builder().name(nameValidateRequest.getName()).build();
    city = cityRepository.save(city);

    auditLogService.saveAuditLog(Constants.ADD, TABLE_NAME, city.getId(), "", "");
    return city;
  }

  public City updateCity(BaseValidateRequest baseValidateRequest, Locale locale) {
    return cityRepository
        .findById(Integer.valueOf(baseValidateRequest.getId()))
        .map(
            city -> {
              String oldName = city.getName();
              city.setName(baseValidateRequest.getName());
              city = cityRepository.save(city);

              auditLogService.saveAuditLog(
                  Constants.UPDATE,
                  TABLE_NAME,
                  city.getId(),
                  oldName,
                  baseValidateRequest.getName());

              return city;
            })
        .orElseThrow(
            () ->
                new CustomException(
                    Utils.formatMessage(
                        messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));
  }

  public void deleteCity(Integer id, Locale locale) {
    cityRepository
        .findById(id)
        .ifPresentOrElse(
            cityRepository::delete,
            () -> {
              throw new CustomException(
                  Utils.formatMessage(
                      messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND));
            });

    auditLogService.saveAuditLog(Constants.DELETE, TABLE_NAME, id, "", "");
  }
}
