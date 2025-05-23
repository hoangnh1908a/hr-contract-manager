package com.project.hrcm.models.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ContactApprovalValidateRequest {

  @NotNull(message = "The ID is required.")
  @Pattern(
      regexp =
          "^[0-9]+$", // The previous regex only allowed single-digit numbers, this allows multiple
      // digits
      message = "The ID must contain only numbers.")
  private Integer id;

  @NotBlank(message = "The approvalStatus is required.")
  private Integer approvalStatus;

  private Integer approvedBy;

  private LocalDateTime approvedDate;

  private String comment;

  private Integer createdBy;

  private Integer updatedBy;

  private Integer contactId;
}
