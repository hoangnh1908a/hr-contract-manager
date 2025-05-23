package com.project.hrcm.models.requests.noRequired;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ConfigsRequest {

  private Integer id;

  @NotBlank(message = "The type is required.")
  private String type;

  @NotBlank(message = "The code is required.")
  private String code;

  @NotBlank(message = "The name is required.")
  private String name;

  @NotBlank(message = "The name in English is required.")
  private String nameEn;

  @NotBlank(message = "The description is required.")
  private String description;
}
