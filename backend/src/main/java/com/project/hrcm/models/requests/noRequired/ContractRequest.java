package com.project.hrcm.models.requests.noRequired;

import lombok.Data;

@Data
public class ContractRequest {

  private String contractId;
  private String recordId;
  private String oldValue;
  private String newValue;
  private String timestamp;
  private String userId;

};
