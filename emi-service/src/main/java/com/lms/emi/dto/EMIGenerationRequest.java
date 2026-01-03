package com.lms.emi.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class EMIGenerationRequest {
    private Long loanApplicationId;
    private BigDecimal principal;
    private BigDecimal annualRate;
    private Integer months;
}
