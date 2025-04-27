package com.project.hrcm.models.requests.noRequired;

import lombok.Data;

@Data
public class UserRequest {

  private String fullName;
  private Integer roleId;
  private String email;
}
;
