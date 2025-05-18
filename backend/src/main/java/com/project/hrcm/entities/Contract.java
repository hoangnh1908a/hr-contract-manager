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
@Table(name = "contracts")
public class Contract {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  private Integer id;

  @Column(nullable = false)
  private String fileName;

  @Column(nullable = false)
  private String fileNameEn;

  @Column
  private String description;

  @Column
  private String filePath;

  @Column(updatable = false)
  private Integer createdBy;

  @Column private Integer updatedBy;

  @CreationTimestamp
  @Column(updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp @Column private LocalDateTime updatedAt;

  // Key
  @Column(nullable = false)
  private Integer employeeId;

  @Column(nullable = false)
  private Integer employerId;

  @Column(nullable = false)
  private Integer contractTemplateId;

  @Column(nullable = false)
  private Integer contractStatusId;
}
