package com.project.hrcm.models.requests.noRequired;

import lombok.Data;

@Data
public class ContactTemplateRequest {

  private String fileName;
  private String description;
  private Integer status;
  private String params;
}
