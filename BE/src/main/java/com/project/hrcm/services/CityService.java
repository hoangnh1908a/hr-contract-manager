package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.City;
import com.project.hrcm.models.requests.BaseRequest;
import com.project.hrcm.models.requests.NameRequest;
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

  public List<City> getCitys() {
    return cityRepository.findAll();
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

  public City updateCity(BaseRequest baseRequest, Locale locale) {
    return cityRepository
        .findById(baseRequest.getId())
        .map(
            city -> {
              String oldName = city.getName();
              city.setName(baseRequest.getName());
              city = cityRepository.save(city);

              auditLogService.saveAuditLog(
                  Constants.UPDATE, TABLE_NAME, city.getId(), oldName, baseRequest.getName());

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

  public City createCity(NameRequest nameRequest, Locale locale) {
    if (cityRepository.existsByName(nameRequest.getName())) {
      throw new CustomException(
          Utils.formatMessage(
              messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NAME_EXISTS));
    }
    City city = City.builder().name(nameRequest.getName()).build();
    city = cityRepository.save(city);

    auditLogService.saveAuditLog(Constants.ADD, TABLE_NAME, city.getId(), "", "");
    return city;
  }
}
