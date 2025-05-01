package com.project.hrcm.models.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NameValidateRequest {

  @NotBlank(message = "The name is required.")
  private String name;

  @NotNull(message = "The status is required.")
  private Integer status;
}
