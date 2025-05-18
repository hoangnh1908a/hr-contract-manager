package com.project.hrcm.models.requests.noRequired;

import lombok.Data;

@Data
public class AuditLogRequest {

  private String tableName;
  private String action;
  private Integer recordId;
  private String newValue;
  private String oldValue;
  private String username;

}
