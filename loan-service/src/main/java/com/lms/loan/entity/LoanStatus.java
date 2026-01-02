package com.lms.loan.entity;

public enum LoanStatus {
    APPLIED("Loan application submitted"),
    UNDER_REVIEW("Loan is under review by loan officer"),
    APPROVED("Loan has been approved"),
    REJECTED("Loan application rejected"),
    CLOSED("Loan is closed after full repayment");

    private final String description;

    LoanStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
