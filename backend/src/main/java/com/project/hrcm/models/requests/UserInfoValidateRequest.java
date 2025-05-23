package com.project.hrcm.models.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserInfoValidateRequest {

  @NotBlank(message = "The fullName is required.")
  private String fullName;

  @NotBlank(message = "The email is required.")
  @Pattern(
      regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      message = "The email address format is invalid.")
  private String email;

  @NotNull(message = "The roleId is required.")
  private Integer roleId;

  @NotNull(message = "The status is required.")
  private Integer status;
}
