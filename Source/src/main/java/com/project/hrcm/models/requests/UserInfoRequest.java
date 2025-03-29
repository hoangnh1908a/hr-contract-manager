package com.project.hrcm.models.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserInfoRequest {

  @NotBlank(message = "The fullName is required.")
  private String fullName;

  @NotBlank(message = "The email is required.")
  @Pattern(
      regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      message = "The email address format is invalid.")
  private String email;

  @NotBlank(message = "The password is required.")
  @Size(min = 8, message = "Password must be at least 3 characters long!")
  private String password;

  @NotNull(message = "The roleId is required.")
  private Integer roleId;
}
