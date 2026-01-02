package com.lms.admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loan_types", indexes = {
        @Index(name = "idx_type_name", columnList = "type_name"),
        @Index(name = "idx_is_active", columnList = "is_active")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String typeName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal minAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal maxAmount;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal baseInterestRate;

    @Column(nullable = false)
    private Integer minTenure; // in months

    @Column(nullable = false)
    private Integer maxTenure; // in months

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Version
    private Long version;
}

