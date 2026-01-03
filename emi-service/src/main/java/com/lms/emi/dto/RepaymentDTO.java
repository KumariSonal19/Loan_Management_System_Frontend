package com.lms.emi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepaymentDTO {

    private Long id;
    private Long emiScheduleId;
    private BigDecimal amountPaid;
    private LocalDate paymentDate;
    private String paymentMode;
    private String transactionId;
}
