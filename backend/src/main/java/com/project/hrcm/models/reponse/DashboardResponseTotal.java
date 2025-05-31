package com.project.hrcm.models.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class DashboardResponseTotal {
  private Integer totalEmployees;
  private Integer totalApprovedContracts;
  private Integer totalPendingContracts;
  private Integer totalContractExpiring;
}
