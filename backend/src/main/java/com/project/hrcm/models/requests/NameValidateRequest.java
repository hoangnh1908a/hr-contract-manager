package com.project.hrcm.models.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NameValidateRequest {

  @NotBlank(message = "The name is required.")
  private String name;

  @NotBlank(message = "The nameEn is required.")
  private String nameEn;

  private Integer status;
}
