package com.lms.emi.service;

import com.lms.emi.dto.EMIScheduleDTO;
import com.lms.emi.dto.RepaymentDTO;
import com.lms.emi.entity.EMISchedule;
import com.lms.emi.entity.EMIStatus;
import com.lms.emi.entity.PaymentMode;
import com.lms.emi.entity.Repayment;
import com.lms.emi.repository.EMIScheduleRepository;
import com.lms.emi.repository.RepaymentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class EMIService {

    @Autowired
    private EMIScheduleRepository emiScheduleRepository;

    @Autowired
    private RepaymentRepository repaymentRepository;

    public List<EMIScheduleDTO> generateEMISchedule(Long loanApplicationId,
                                                   BigDecimal principal,
                                                   BigDecimal annualRate,
                                                   Integer months,
                                                   LocalDate startDate) {

        List<EMISchedule> existing = emiScheduleRepository.findByLoanApplicationId(loanApplicationId);
        if (!existing.isEmpty()) {
            throw new RuntimeException("EMI schedule already exists for this loan");
        }

        List<EMISchedule> schedules = new ArrayList<>();

        BigDecimal monthlyRate = annualRate.divide(new BigDecimal(1200), 10, RoundingMode.HALF_UP);
        BigDecimal emi = calculateEMI(principal, annualRate, months);
        BigDecimal remainingBalance = principal;

        for (int i = 1; i <= months; i++) {
            EMISchedule schedule = new EMISchedule();
            schedule.setLoanApplicationId(loanApplicationId);
            schedule.setEmiNumber(i);
            schedule.setDueDate(startDate.plusMonths(i));
            schedule.setEmiAmount(emi);

            BigDecimal interest = remainingBalance.multiply(monthlyRate)
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal principalAmount = emi.subtract(interest)
                    .setScale(2, RoundingMode.HALF_UP);

            schedule.setInterestAmount(interest);
            schedule.setPrincipalAmount(principalAmount);

            remainingBalance = remainingBalance.subtract(principalAmount)
                    .setScale(2, RoundingMode.HALF_UP);

            if (i == months) {
                schedule.setRemainingBalance(BigDecimal.ZERO);
            } else {
                schedule.setRemainingBalance(remainingBalance);
            }

            schedule.setStatus(EMIStatus.PENDING);
            schedules.add(emiScheduleRepository.save(schedule));
        }

        log.info("EMI schedule generated - Loan: {}, Schedules: {}", loanApplicationId, months);
        return schedules.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

public RepaymentDTO recordRepayment(Long emiScheduleId, BigDecimal amount, PaymentMode paymentMode) {
        
        EMISchedule schedule = emiScheduleRepository.findById(emiScheduleId)
                .orElseThrow(() -> new RuntimeException("EMI schedule not found"));

        if (!schedule.getStatus().equals(EMIStatus.PENDING) && !schedule.getStatus().equals(EMIStatus.OVERDUE)) {
            throw new RuntimeException("EMI is already paid");
        }

        if (amount.compareTo(schedule.getEmiAmount()) < 0) {
            throw new RuntimeException("Insufficient Amount: You must pay at least " + schedule.getEmiAmount());
        }

        String autoTransactionId = "TXN-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();

        Repayment repayment = new Repayment();
        repayment.setEmiSchedule(schedule);
        repayment.setAmountPaid(amount); 
        repayment.setPaymentDate(LocalDate.now());
        repayment.setPaymentMode(paymentMode); 
        repayment.setTransactionId(autoTransactionId); 

        repayment = repaymentRepository.save(repayment);
        
        schedule.setStatus(EMIStatus.PAID);
        emiScheduleRepository.save(schedule);

        log.info("Repayment recorded - EMI ID: {}, Txn: {}", emiScheduleId, autoTransactionId);
        return mapRepaymentToDTO(repayment);
    }

    public BigDecimal getOutstandingBalance(Long loanApplicationId) {
        List<EMISchedule> schedules = emiScheduleRepository.findByLoanApplicationIdOrderByEmiNumber(loanApplicationId);

        if (schedules.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal totalOutstanding = BigDecimal.ZERO;
        for (EMISchedule schedule : schedules) {
            if (!schedule.getStatus().equals(EMIStatus.PAID)) {
                totalOutstanding = totalOutstanding.add(schedule.getEmiAmount());
            }
        }

        return totalOutstanding.setScale(2, RoundingMode.HALF_UP);
    }

    public List<EMIScheduleDTO> getOverdueEMIs() {
        return emiScheduleRepository.findByStatusAndDueDateBefore(EMIStatus.PENDING, LocalDate.now())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private BigDecimal calculateEMI(BigDecimal principal, BigDecimal annualRate, Integer months) {
        BigDecimal rate = annualRate.divide(new BigDecimal(1200), 10, RoundingMode.HALF_UP);
        BigDecimal oneRate = BigDecimal.ONE.add(rate);
        BigDecimal powerN = oneRate.pow(months);

        BigDecimal numerator = principal.multiply(rate).multiply(powerN);
        BigDecimal denominator = powerN.subtract(BigDecimal.ONE);

        return numerator.divide(denominator, 2, RoundingMode.HALF_UP);
    }

    private EMIScheduleDTO mapToDTO(EMISchedule schedule) {
        return new EMIScheduleDTO(
                schedule.getId(),
                schedule.getLoanApplicationId(),
                schedule.getEmiNumber(),
                schedule.getDueDate(),
                schedule.getEmiAmount(),
                schedule.getPrincipalAmount(),
                schedule.getInterestAmount(),
                schedule.getRemainingBalance(),
                schedule.getStatus()
        );
    }

    private RepaymentDTO mapRepaymentToDTO(Repayment repayment) {
        return new RepaymentDTO(
                repayment.getId(),
                repayment.getEmiSchedule().getId(),
                repayment.getAmountPaid(),
                repayment.getPaymentDate(),
                repayment.getPaymentMode().name(), 
                repayment.getTransactionId()
        );
    }

    public List<EMIScheduleDTO> getEMISchedule(Long loanApplicationId) {
        return emiScheduleRepository.findByLoanApplicationIdOrderByEmiNumber(loanApplicationId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}
