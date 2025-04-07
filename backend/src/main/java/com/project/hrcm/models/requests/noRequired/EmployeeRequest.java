package com.project.hrcm.models.requests.noRequired;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

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
  private String departmentId;

  private String positionId;
}
