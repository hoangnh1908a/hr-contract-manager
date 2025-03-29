package com.project.hrcm.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "contacts")
public class Contact {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  private Integer id;

  @Column(nullable = false)
  private String fileName;

  @Column(nullable = false)
  private String description;

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
  private Integer templateId;

  @Column(nullable = false)
  private Integer contactStatusId;
}
