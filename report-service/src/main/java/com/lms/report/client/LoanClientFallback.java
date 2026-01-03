package com.lms.report.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Slf4j
public class LoanClientFallback implements LoanClient {

    @Override
    public Long getAppliedLoansCount() {
        log.warn("Loan service unavailable - returning default value for applied loans");
        return 0L;
    }

    @Override
    public Long getUnderReviewLoansCount() {
        log.warn("Loan service unavailable - returning default value for under review loans");
        return 0L;
    }

    @Override
    public Long getApprovedLoansCount() {
        log.warn("Loan service unavailable - returning default value for approved loans");
        return 0L;
    }

    @Override
    public Long getRejectedLoansCount() {
        log.warn("Loan service unavailable - returning default value for rejected loans");
        return 0L;
    }

    @Override
    public Long getClosedLoansCount() {
        log.warn("Loan service unavailable - returning default value for closed loans");
        return 0L;
    }

    @Override
    public Long getTotalLoansCount() {
        log.warn("Loan service unavailable - returning default value for total loans");
        return 0L;
    }

    @Override
    public Long getLoansCountByType(String loanType) {
        log.warn("Loan service unavailable - returning 0 for loan type: {}", loanType);
        return 0L;
    }

    @Override
    public Long getApprovedLoansCountByType(String loanType) {
        log.warn("Loan service unavailable - returning 0 for approved loans by type: {}", loanType);
        return 0L;
    }

    @Override
    public BigDecimal getTotalDisbursedAmountByType(String loanType) {
        log.warn("Loan service unavailable - returning 0 for disbursed amount: {}", loanType);
        return BigDecimal.ZERO;
    }

    @Override
    public BigDecimal getCustomerTotalLoanAmount(Long customerId) {
        log.warn("Loan service unavailable - returning 0 for customer: {}", customerId);
        return BigDecimal.ZERO;
    }
}
