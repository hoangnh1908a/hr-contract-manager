package com.project.hrcm.services;

import com.project.hrcm.entities.AuditLog;
import com.project.hrcm.entities.UserInfo;
import com.project.hrcm.models.requests.noRequired.AuditLogRequest;
import com.project.hrcm.repository.AuditLogRepository;
import com.project.hrcm.repository.UserInfoRepository;
import com.project.hrcm.services.userInfo.UserInfoService;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import io.micrometer.common.util.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@AllArgsConstructor
@Service
public class AuditLogService {

  private final AuditLogRepository auditLogRepository;
  private final UserInfoRepository userInfoRepository;

  public static Specification<AuditLog> filterBy(AuditLogRequest auditLogRequest, Integer userId) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      if (StringUtils.isNotBlank(auditLogRequest.getTableName())) {
        predicates.add(
            cb.like(
                cb.lower(root.get("tableName")),
                "%" + auditLogRequest.getTableName().toLowerCase() + "%"));
      }
      if (auditLogRequest.getRecordId() != null) {
        predicates.add(cb.equal(root.get("recordId"), auditLogRequest.getRecordId()));
      }
      if (StringUtils.isNotBlank(auditLogRequest.getOldValue())) {
        predicates.add(
            cb.like(
                cb.lower(root.get("oldValue")),
                "%" + auditLogRequest.getOldValue().toLowerCase() + "%"));
      }
      if (StringUtils.isNotBlank(auditLogRequest.getNewValue())) {
        predicates.add(
            cb.like(
                cb.lower(root.get("newValue")),
                "%" + auditLogRequest.getNewValue().toLowerCase() + "%"));
      }
      if (StringUtils.isNotBlank(auditLogRequest.getAction())) {
        predicates.add(
            cb.like(
                cb.lower(root.get("action")),
                "%" + auditLogRequest.getAction().toLowerCase() + "%"));
      }
      if (userId != null) {
        predicates.add(cb.equal(root.get("userId"), userId));
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  public Page<AuditLog> getAuditLogs(AuditLogRequest auditLogRequest, Pageable pageable) {

    Integer userId = null;

    if (StringUtils.isNotBlank(auditLogRequest.getUsername())) {
      userId = userInfoRepository.getIdByFullName(auditLogRequest.getUsername());
    }

    Specification<AuditLog> spec = filterBy(auditLogRequest, userId);

    Page<AuditLog> auditLogPage = auditLogRepository.findAll(spec, pageable);

    List<Integer> userIds =
        auditLogPage.stream().map(AuditLog::getUserId).filter(Objects::nonNull).toList();

    Map<Integer, String> userIdToFullName =
        userInfoRepository.findAllById(userIds).stream()
            .collect(Collectors.toMap(UserInfo::getId, UserInfo::getFullName));

    return auditLogPage.map(
        e -> {
          e.setFullName(userIdToFullName.get(e.getUserId()));
          return e;
        });
  }

  @Async
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
