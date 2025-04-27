package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.District;
import com.project.hrcm.models.requests.BaseValidateRequest;
import com.project.hrcm.models.requests.NameValidateRequest;
import com.project.hrcm.models.requests.noRequired.DistrictRequest;
import com.project.hrcm.repository.DistrictRepository;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import java.util.List;
import java.util.Locale;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DistrictService {

  private final String TABLE_NAME = "DISTRICT";

  private final DistrictRepository districtRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;

  public Page<District> getDistricts(DistrictRequest district, Pageable pageable) {
      if (district != null){
          if (district.getCityId() != null) {
              return districtRepository.findByNameLikeIgnoreCaseAndCityId(district.getName(), district.getCityId(), pageable);
          }
           else{
              return districtRepository.findByNameLikeIgnoreCase(district.getName(), pageable);
           }
      }
      return districtRepository.findAll(pageable);
  }

  public District getDistrictById(Integer id, Locale locale) {
    District district =
        districtRepository
            .findById(id)
            .orElseThrow(
                () ->
                    new CustomException(
                        Utils.formatMessage(
                            messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));

    auditLogService.saveAuditLog(Constants.GET_ID, TABLE_NAME, district.getId(), "", "");

    return district;
  }

  public District createDistrict(DistrictRequest districtRequest, Locale locale) {
    if (districtRepository.existsByName(districtRequest.getName().trim())) {
      throw new CustomException(
          Utils.formatMessage(
              messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NAME_EXISTS));
    }
    District district = District.builder()
            .name(districtRequest.getName().trim())
            .cityId(districtRequest.getCityId())
            .build();
    district = districtRepository.save(district);

    auditLogService.saveAuditLog(Constants.ADD, TABLE_NAME, district.getId(), "", Utils.gson.toJson(district));
    return district;
  }

  public District updateDistrict(DistrictRequest districtRequest, Locale locale) {
    return districtRepository
        .findById(districtRequest.getId())
        .map(
            district -> {
              String oldName = Utils.gson.toJson(district);
              district.setName(districtRequest.getName().trim());
              district.setCityId(districtRequest.getCityId());

              district = districtRepository.save(district);

              auditLogService.saveAuditLog(
                  Constants.UPDATE, TABLE_NAME, district.getId(), oldName, Utils.gson.toJson(district));

              return district;
            })
        .orElseThrow(
            () ->
                new CustomException(
                    Utils.formatMessage(
                        messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND)));
  }

  public void deleteDistrict(Integer id, Locale locale) {
    districtRepository
        .findById(id)
        .ifPresentOrElse(
            districtRepository::delete,
            () -> {
              throw new CustomException(
                  Utils.formatMessage(
                      messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NOT_FOUND));
            });

    auditLogService.saveAuditLog(Constants.DELETE, TABLE_NAME, id, "", "");
  }
}
