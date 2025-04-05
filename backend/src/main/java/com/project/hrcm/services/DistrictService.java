package com.project.hrcm.services;

import com.project.hrcm.configs.CustomException;
import com.project.hrcm.entities.District;
import com.project.hrcm.models.requests.BaseRequest;
import com.project.hrcm.models.requests.NameRequest;
import com.project.hrcm.repository.DistrictRepository;
import com.project.hrcm.utils.Constants;
import com.project.hrcm.utils.Utils;
import java.util.List;
import java.util.Locale;
import lombok.AllArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DistrictService {

  private final String TABLE_NAME = "DISTRICT";

  private final DistrictRepository districtRepository;
  private final MessageSource messageSource;
  private final AuditLogService auditLogService;

  public List<District> getDistricts() {
    return districtRepository.findAll();
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

  public District updateDistrict(BaseRequest baseRequest, Locale locale) {
    return districtRepository
        .findById(baseRequest.getId())
        .map(
            district -> {
              String oldName = district.getName();
              district.setName(baseRequest.getName());
              district = districtRepository.save(district);

              auditLogService.saveAuditLog(
                  Constants.UPDATE, TABLE_NAME, district.getId(), oldName, baseRequest.getName());

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

  public District createDistrict(NameRequest nameRequest, Locale locale) {
    if (districtRepository.existsByName(nameRequest.getName())) {
      throw new CustomException(
          Utils.formatMessage(
              messageSource, locale, TABLE_NAME.toLowerCase(), Constants.NAME_EXISTS));
    }
    District district = District.builder().name(nameRequest.getName()).build();
    district = districtRepository.save(district);

    auditLogService.saveAuditLog(Constants.ADD, TABLE_NAME, district.getId(), "", "");
    return district;
  }
}
