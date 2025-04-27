package com.project.hrcm.models.requests.noRequired;

import lombok.Data;

@Data
public class DistrictRequest extends NameRequest {

  private Integer cityId;
  private Integer id;
}
