package com.project.hrcm.controllers;

import com.project.hrcm.entities.AuditLog;
import com.project.hrcm.models.requests.noRequired.AuditLogRequest;
import com.project.hrcm.services.AuditLogService;
import com.project.hrcm.utils.Constants;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/audit-log")
public class AuditLogController {

  private final AuditLogService service;

  @GetMapping()
  @PreAuthorize("hasAuthority('" + Constants.ROLE_ADMIN + "')")
  public ResponseEntity<Page<AuditLog>> getAuditLogs(AuditLogRequest auditLogRequest,Pageable pageable) {
    Page<AuditLog> auditLogs = service.getAuditlogs(auditLogRequest, pageable);
    return new ResponseEntity<>(auditLogs, HttpStatus.OK);
  }
}
