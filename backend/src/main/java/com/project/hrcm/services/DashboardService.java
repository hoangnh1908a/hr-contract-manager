package com.project.hrcm.services;

import com.project.hrcm.models.reponse.CustomContractData;
import com.project.hrcm.models.reponse.DashboardResponseTotal;
import com.project.hrcm.models.reponse.TableDashboard;
import com.project.hrcm.repository.ContractRepository;
import com.project.hrcm.repository.EmployeeRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class DashboardService {

  private final ContractRepository contractRepository;
  private final EmployeeRepository employeeRepository;

  public DashboardResponseTotal getDashBoardTotal() {

    LocalDateTime now = LocalDateTime.now();
    LocalDateTime startDateOfYear = now.with(TemporalAdjusters.firstDayOfYear());
    LocalDateTime endDateOfYear = now.with(TemporalAdjusters.lastDayOfYear());

    // get contractStatusId, contractType
    List<CustomContractData> contracts = contractRepository.findDashBoardTotal(startDateOfYear, endDateOfYear);
    Integer employees = employeeRepository.findTableExpiringEmployee(100).size();

    Long totalApprovedContracts =
        contracts.stream().filter(c -> c.getContractStatusId() == 1).count();

    Integer totalContractExpiring = employeeRepository.findTableExpiringEmployee(12).size();

    return DashboardResponseTotal.builder()
        .totalApprovedContracts(totalApprovedContracts.intValue())
        .totalContractExpiring(totalContractExpiring)
        .totalEmployees(employees)
        .totalPendingContracts((int) (contracts.size() - totalApprovedContracts))
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
