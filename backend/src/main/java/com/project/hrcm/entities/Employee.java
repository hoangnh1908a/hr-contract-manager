package com.project.hrcm.entities;

import jakarta.persistence.*;
import java.time.LocalDate;
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
@Table(name = "employees")
public class Employee {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  private Integer id;

  @Column(nullable = false)
  private String fullName;

  @Column(nullable = false)
  private String numberId;

  @Column(nullable = false)
  private LocalDate dateOfBirth;

  @Column(nullable = false)
  private String sex;

  @Column(nullable = false)
  private String nationality; // Quoc tich

  @Column private String placeOfOrigin; // Que quan

  @Column private String placeOfResidence; // Nguyen quan

  @Column(nullable = false)
  private String email;

  @Column(nullable = false)
  private String phone;

  @Column(nullable = false)
  private LocalDate hireDate;

  @Column(nullable = false)
  private String salary;

  @Column(nullable = false)
  private String salaryAllowance;

  @Column(nullable = false)
  private Integer status;

  @CreationTimestamp
  @Column(updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp @Column private LocalDateTime updatedAt;

  // Key
  @Column(nullable = false)
  private Integer departmentId;

  @Column(nullable = false)
  private Integer positionId;

  @Transient private String department;
  @Transient private String position;
}
