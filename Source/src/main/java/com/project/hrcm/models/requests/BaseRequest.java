package com.project.hrcm.models.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BaseRequest {

  @NotNull(message = "The ID is required.")
  @Pattern(
          regexp = "^[0-9]+$",  // The previous regex only allowed single-digit numbers, this allows multiple digits
          message = "The ID must contain only numbers.")
  private Integer id;

  @NotBlank(message = "The name is required.")
  private String name;
}
