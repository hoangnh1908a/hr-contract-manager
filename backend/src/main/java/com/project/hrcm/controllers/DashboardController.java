package com.project.hrcm.controllers;

import com.project.hrcm.models.reponse.DashboardResponseTotal;
import com.project.hrcm.models.reponse.TableDashboard;
import com.project.hrcm.services.DashboardService;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/dashboard")
public class DashboardController {

  private final DashboardService service;

  //  Report
  @GetMapping
  public ResponseEntity<DashboardResponseTotal> getContractDashboard() {
    DashboardResponseTotal response = service.getDashBoardTotal();
    // Return the file as a ResponseEntity
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @GetMapping("/table")
  public ResponseEntity<List<TableDashboard>> getTableContractDashboard(
      @RequestParam Integer monthExpire) {
    List<TableDashboard> response = service.getTableDashBoard(monthExpire);
    // Return the file as a ResponseEntity
    return new ResponseEntity<>(response, HttpStatus.OK);
  }
}
