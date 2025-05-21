package com.project.hrcm.models.reponse;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

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
