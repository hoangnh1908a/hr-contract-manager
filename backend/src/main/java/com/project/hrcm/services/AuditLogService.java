package com.project.hrcm.services;

import com.project.hrcm.entities.AuditLog;
import com.project.hrcm.repository.AuditLogRepository;
import com.project.hrcm.services.userInfo.UserInfoService;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@AllArgsConstructor
@Service
public class AuditLogService {

  private final AuditLogRepository auditLogRepository;

  @Async
  @Transactional
  public void saveAuditLog(
      String action, String tableName, Integer recordId, String oldValue, String newValue) {
    AuditLog auditLog =
        AuditLog.builder()
            .action(action)
            .tableName(tableName)
            .recordId(recordId)
            .oldValue(oldValue)
            .newValue(newValue)
            .userId(UserInfoService.getCurrentUserId())
            .build();

    auditLogRepository.save(auditLog);
  }
}
