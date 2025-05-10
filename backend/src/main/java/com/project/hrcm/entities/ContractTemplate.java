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
@Table(name = "contract_templates")
public class ContractTemplate {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  private Integer id;

  @Column(nullable = false)
  private String fileName;

  @Column(nullable = false)
  private String fileNameEn;

  @Column(nullable = false)
  private String filePath;

  @Column
  private String params;

  @Column(nullable = false)
  private String description;

  @Column(nullable = false)
  private Integer status; // 0, 1

  @Column(nullable = false)
  private Integer createdBy;

  @Column private Integer updatedBy;

  @CreationTimestamp
  @Column(updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp @Column private LocalDateTime updatedAt;
}
