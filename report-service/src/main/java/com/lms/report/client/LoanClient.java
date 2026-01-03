package com.lms.report.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;

@FeignClient(name = "loan-service", fallback = LoanClientFallback.class)
public interface LoanClient {

    @GetMapping("/api/loans/count/applied")
    Long getAppliedLoansCount();

    @GetMapping("/api/loans/count/under_review")
    Long getUnderReviewLoansCount();

    @GetMapping("/api/loans/count/approved")
    Long getApprovedLoansCount();

    @GetMapping("/api/loans/count/rejected")
    Long getRejectedLoansCount();

    @GetMapping("/api/loans/count/closed")
    Long getClosedLoansCount();

    @GetMapping("/api/loans/total")
    Long getTotalLoansCount();

    @GetMapping("/api/loans/by-type")
    Long getLoansCountByType(@RequestParam String loanType);

    @GetMapping("/api/loans/approved-by-type")
    Long getApprovedLoansCountByType(@RequestParam String loanType);

    @GetMapping("/api/loans/total-amount-by-type")
    BigDecimal getTotalDisbursedAmountByType(@RequestParam String loanType);

    @GetMapping("/api/loans/customer/{customerId}/total-amount")
    BigDecimal getCustomerTotalLoanAmount(@PathVariable Long customerId);
}
