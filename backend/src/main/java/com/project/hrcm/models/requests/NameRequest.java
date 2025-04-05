package com.project.hrcm.models.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NameRequest {

  @NotBlank(message = "The name is required.")
  private String name;
}
