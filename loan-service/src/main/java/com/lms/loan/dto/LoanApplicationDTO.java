package com.lms.loan.dto;

import com.lms.loan.entity.LoanStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanApplicationDTO {

    private Long id;

    @NotNull(message = "Loan type ID is required")
    private Long loanTypeId;

    @NotNull(message = "Loan amount is required")
    @DecimalMin(value = "10000.0", message = "Minimum loan amount is 10000")
    @DecimalMax(value = "5000000.0", message = "Maximum loan amount is 5000000")
    private BigDecimal loanAmount;

    @NotNull(message = "Tenure is required")
    @Min(value = 6, message = "Minimum tenure is 6 months")
    @Max(value = 360, message = "Maximum tenure is 360 months")
    private Integer tenure;

    @NotNull(message = "Annual income is required")
    @DecimalMin(value = "0.0")
    private BigDecimal annualIncome;

    @DecimalMin(value = "0.0", message = "Employment score must be between 0 and 100")
    @DecimalMax(value = "100.0", message = "Employment score must be between 0 and 100")
    private BigDecimal employmentScore;

    private LoanStatus status;
    private BigDecimal approvedAmount;
    private BigDecimal approvedInterestRate;
    private String approvalRemarks;
    private LocalDateTime appliedDate;
    private LocalDateTime approvalDate;
    private LocalDateTime closedDate;
}
