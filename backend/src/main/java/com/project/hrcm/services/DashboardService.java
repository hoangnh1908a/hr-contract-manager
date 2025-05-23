package com.project.hrcm.services;

import com.project.hrcm.models.reponse.CustomContractData;
import com.project.hrcm.models.reponse.DashboardResponseTotal;
import com.project.hrcm.models.reponse.TableDashboard;
import com.project.hrcm.repository.ContractRepository;
import com.project.hrcm.repository.EmployeeRepository;
import java.util.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class DashboardService {

  private final ContractRepository contractRepository;
  private final EmployeeRepository employeeRepository;

  public DashboardResponseTotal getDashBoardTotal() {
    // get contractStatusId, contractType
    List<CustomContractData> contracts = contractRepository.findDashBoardTotal();
    Long employees = employeeRepository.count();

    Long totalApprovedContracts =
        contracts.stream().filter(c -> c.getContractStatusId() == 1).count();

    Integer totalContractExpiring = employeeRepository.findExpiringEmployee().size();

    return DashboardResponseTotal.builder()
        .totalApprovedContracts(totalApprovedContracts)
        .totalContractExpiring(totalContractExpiring.longValue())
        .totalEmployees(employees)
        .totalPendingContracts((long) contracts.size() - totalApprovedContracts)
        .build();
  }

  public List<TableDashboard> getTableDashBoard(Integer monthExpire) {
    // get contractStatusId, contractType
    List<Object[]> rawData = employeeRepository.findTableExpiringEmployee(monthExpire);

    return rawData.stream()
        .map(
            row ->
                new TableDashboard(
                    (String) row[0],
                    (Date) row[1],
                    (String) row[2],
                    (String) row[3],
                    (String) row[4],
                    (Date) row[5]))
        .toList();
  }
}
