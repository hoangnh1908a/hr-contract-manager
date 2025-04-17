package com.project.hrcm.models.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BaseValidateRequest {

  @NotBlank(message = "The id is required.")
  private String id;

  @NotBlank(message = "The name is required.")
  private String name;

  private String status;
}
