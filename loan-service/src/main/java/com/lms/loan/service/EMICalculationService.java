package com.lms.loan.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@Slf4j
public class EMICalculationService {

    public BigDecimal calculateEMI(BigDecimal principal, BigDecimal annualRate, Integer months) {
        if (principal == null || annualRate == null || months == null || months <= 0) {
            throw new IllegalArgumentException("Invalid EMI calculation parameters");
        }

        BigDecimal P = principal;
        BigDecimal rate = annualRate.divide(new BigDecimal(1200), 10, RoundingMode.HALF_UP); 
        BigDecimal n = new BigDecimal(months);

        BigDecimal oneRate = BigDecimal.ONE.add(rate);
        BigDecimal powerN = oneRate.pow(months);

        BigDecimal numerator = P.multiply(rate).multiply(powerN);

        BigDecimal denominator = powerN.subtract(BigDecimal.ONE);

        BigDecimal emi = numerator.divide(denominator, 2, RoundingMode.HALF_UP);

        log.info("EMI Calculated - Principal: {}, Rate: {}%, Months: {}, EMI: {}", 
                 P, annualRate, months, emi);

        return emi;
    }

    public BigDecimal calculateTotalAmount(BigDecimal emi, Integer months) {
        return emi.multiply(new BigDecimal(months)).setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateTotalInterest(BigDecimal principal, BigDecimal totalAmount) {
        return totalAmount.subtract(principal).setScale(2, RoundingMode.HALF_UP);
    }

    public void calculateMonthlyBreakdown(BigDecimal principal, BigDecimal annualRate, 
                                         Integer months, Integer currentMonth) {
        BigDecimal monthlyRate = annualRate.divide(new BigDecimal(1200), 10, RoundingMode.HALF_UP);
        BigDecimal emi = calculateEMI(principal, annualRate, months);

        BigDecimal remainingBalance = principal;
        
        for (int i = 1; i <= Math.min(currentMonth, months); i++) {
            BigDecimal interest = remainingBalance.multiply(monthlyRate)
                    .setScale(2, RoundingMode.HALF_UP);
            BigDecimal principalAmount = emi.subtract(interest)
                    .setScale(2, RoundingMode.HALF_UP);
            remainingBalance = remainingBalance.subtract(principalAmount);

            if (i == currentMonth) {
                log.info("Month {}: Interest={}, Principal={}, Remaining={}",
                         i, interest, principalAmount, remainingBalance);
            }
        }
    }
}
