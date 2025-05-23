package com.project.hrcm.models.reponse;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class TableDashboard {
  private String fullName;
  private Date hireDate;
  private String position;
  private String department;
  private String contractType;
  private Date contractEndDate;
}
