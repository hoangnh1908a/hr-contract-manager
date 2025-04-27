package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.City;
import com.project.hrcm.models.requests.BaseValidateRequest;
import com.project.hrcm.repository.CityRepository;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import java.util.Locale;
import java.util.Optional;
import lombok.AllArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CityService {

  private final String TABLE_NAME = "CITY";

  private final CityRepository cityRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;

  public Page<City> getCities(String name, Pageable pageable) {
    return cityRepository.findByNameContainingIgnoreCase(name, pageable);
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

  public City createCity(String name, Locale locale) {
    if (cityRepository.existsByName(name.trim())) {
      throw new CustomException(
          Utils.formatMessage(
              messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NAME_EXISTS));
    }
    City city = City.builder().name(name).build();
    city = cityRepository.save(city);

    auditLogService.saveAuditLog(
        Constants.ADD, TABLE_NAME, city.getId(), "", Utils.gson.toJson(city));
    return city;
  }

  public City updateCity(BaseValidateRequest baseValidateRequest, Locale locale) {
    return cityRepository
        .findById(Integer.valueOf(baseValidateRequest.getId()))
        .map(
            city -> {
              String old = Utils.gson.toJson(city);
              city.setName(baseValidateRequest.getName());
              city = cityRepository.save(city);

              auditLogService.saveAuditLog(
                  Constants.UPDATE, TABLE_NAME, city.getId(), old, Utils.gson.toJson(city));

              return city;
            })
        .orElseThrow(
            () ->
                new CustomException(
                    Utils.formatMessage(
                        messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));
  }

  public void deleteCity(Integer id, Locale locale) {
    Optional<City> city = cityRepository.findById(id);
    city.ifPresentOrElse(
        cityRepository::delete,
        () -> {
          throw new CustomException(
              Utils.formatMessage(
                  messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND));
        });

    auditLogService.saveAuditLog(Constants.DELETE, TABLE_NAME, id, Utils.gson.toJson(city), "");
  }
}
