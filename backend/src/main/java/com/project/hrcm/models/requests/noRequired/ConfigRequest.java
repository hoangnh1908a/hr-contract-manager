package com.project.hrcm.models.requests.noRequired;

import lombok.Data;

@Data
public class ConfigRequest {

  private String name;
  private String type;
  private String code;
  private String description;
}
