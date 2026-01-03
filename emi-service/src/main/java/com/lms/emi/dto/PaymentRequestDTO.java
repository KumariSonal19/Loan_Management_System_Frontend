package com.lms.emi.dto;

import com.lms.emi.entity.PaymentMode;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal; 

@Data
public class PaymentRequestDTO {
    @NotNull(message = "EMI Schedule ID is required")
    private Long emiScheduleId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than 0")
    private BigDecimal amountPaid; 
    @NotNull(message = "Payment mode is required")
    private PaymentMode paymentMode; 
}