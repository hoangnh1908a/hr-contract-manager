package com.project.hrcm.models.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class DashboardResponseTotal {
    private Long totalEmployees;
    private Long totalApprovedContracts;
    private Long totalPendingContracts;
    private Long totalContractExpiring;
}
