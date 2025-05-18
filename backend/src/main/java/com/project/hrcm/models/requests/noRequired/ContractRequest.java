package com.project.hrcm.models.requests.noRequired;

import lombok.Data;

@Data
public class ContractRequest {

  private Integer id;
  private String fileName;
  private String fileNameEn;
  private String description;
  private String createdBy;
  private String updatedBy;
  private String toDate;
  private String fromDate;
  private String htmlContract;

  private Integer employeeId;
  private Integer employerId;
  private Integer contractTemplateId;
  private Integer contractStatusId;

}
