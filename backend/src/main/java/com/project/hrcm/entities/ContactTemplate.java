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
@Table(name = "contact_templates")
public class ContactTemplate {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  private Integer id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private String filePath;

  @Column(nullable = false)
  private String description;

  @Column(nullable = false)
  private Integer createdBy;

  @Column private Integer updatedBy;

  @CreationTimestamp
  @Column(updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp @Column private LocalDateTime updatedAt;
}
