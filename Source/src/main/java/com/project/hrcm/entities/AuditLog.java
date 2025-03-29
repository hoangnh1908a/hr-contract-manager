package com.project.hrcm.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Integer id;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private String tableName;

    @Column(nullable = false)
    private Integer recordId;

    @Column
    private String oldValue;

    @Column
    private String newValue;


    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime timestamp;

    // Key
    @Column(nullable = false)
    private Integer userId;
}
