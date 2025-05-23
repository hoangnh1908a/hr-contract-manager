package com.project.hrcm.models.reponse;

import com.project.hrcm.entities.Employee;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmployeeValueData {

  private Employee employee;
  private String position;
  private String department;
}
