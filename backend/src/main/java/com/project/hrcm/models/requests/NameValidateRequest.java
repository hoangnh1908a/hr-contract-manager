package com.project.hrcm.models.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NameValidateRequest {

  @NotBlank(message = "The name is required.")
  private String name;

  @NotBlank(message = "The status is required.")
  private String status;
}
