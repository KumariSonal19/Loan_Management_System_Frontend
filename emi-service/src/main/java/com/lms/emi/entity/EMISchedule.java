package com.lms.emi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "emi_schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EMISchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long loanApplicationId;

    @Column(nullable = false)
    private Integer emiNumber;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal emiAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal principalAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal interestAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal remainingBalance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EMIStatus status = EMIStatus.PENDING;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
