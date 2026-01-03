package com.lms.admin.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanTypeDTO {

    private Long id;

    @NotBlank(message = "Loan type name is required")
    @Size(min = 3, max = 50, message = "Loan type name must be between 3 and 50 characters")
    private String typeName;

    @NotNull(message = "Minimum amount is required")
    @DecimalMin(value = "10000.0", message = "Minimum amount must be at least 10,000")
    private BigDecimal minAmount;

    @NotNull(message = "Maximum amount is required")
    @DecimalMax(value = "5000000.0", message = "Maximum amount cannot exceed 5,000,000")
    private BigDecimal maxAmount;

    @NotNull(message = "Interest rate is required")
    @DecimalMin(value = "1.0", message = "Interest rate must be at least 1%")
    @DecimalMax(value = "50.0", message = "Interest rate cannot exceed 50%")
    private BigDecimal baseInterestRate;

    @NotNull(message = "Minimum tenure is required")
    @Min(value = 6, message = "Minimum tenure must be at least 6 months")
    private Integer minTenure;

    @NotNull(message = "Maximum tenure is required")
    @Max(value = 240, message = "Maximum tenure cannot exceed 240 months (20 years)")
    private Integer maxTenure;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    private Boolean isActive = true;
}
