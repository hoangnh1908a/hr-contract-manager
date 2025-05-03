package com.project.hrcm.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "contract_approvals")
public class ContractApproval {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  private Integer id;

  @Column private String comment;

  @Column private Integer approvedBy;

  @Column private LocalDateTime approvedDate;

  @Column private Integer approvalStatus;

  @Column private Integer createdBy;

  @Column private Integer updatedBy;

  @CreationTimestamp
  @Column(updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp @Column private LocalDateTime updatedAt;

  // Key
  @Column(nullable = false)
  private Integer contactId;

  @Column(nullable = false)
  private Integer contactStatusId;
}
