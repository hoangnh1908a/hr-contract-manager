package com.project.hrcm.models.requests.noRequired;

import lombok.Data;

@Data
public class EmployeeRequest {

  private Integer id;

  private String fullName;

  private String numberId;

  private String dateOfBirth;

  private String sex;

  private String nationality;

  private String placeOfOrigin;

  private String placeOfResidence;

  private String email;

  private String phone;

  private String hireDate;

  private Integer status;

  // Key
  private Integer departmentId;

  private Integer positionId;
}
