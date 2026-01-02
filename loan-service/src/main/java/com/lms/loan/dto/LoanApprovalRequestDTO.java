package com.lms.loan.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanApprovalRequestDTO {

    @NotNull(message = "Loan ID is required")
    private Long loanId;

    @NotNull(message = "Status is required (UNDER_REVIEW, APPROVED, REJECTED)")
    private String status;
//    
//    @NotNull(message = "Approved amount is required")
//    @DecimalMin(value = "0.0")
    private BigDecimal approvedAmount;

//    @NotNull(message = "Interest rate is required")
//    @DecimalMin(value = "0.0")
//    @DecimalMax(value = "50.0", message = "Interest rate cannot exceed 50%")
    private BigDecimal interestRate;

    @NotBlank(message = "Remarks are required")
    private String remarks;
}
