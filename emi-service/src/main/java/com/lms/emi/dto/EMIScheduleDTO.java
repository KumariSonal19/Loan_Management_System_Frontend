package com.lms.emi.dto;

import com.lms.emi.entity.EMIStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EMIScheduleDTO {

    private Long id;
    private Long loanApplicationId;
    private Integer emiNumber;
    private LocalDate dueDate;
    private BigDecimal emiAmount;
    private BigDecimal principalAmount;
    private BigDecimal interestAmount;
    private BigDecimal remainingBalance;
    private EMIStatus status;
}
