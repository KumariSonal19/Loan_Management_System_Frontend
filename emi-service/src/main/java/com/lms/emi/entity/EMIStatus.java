package com.lms.emi.entity;

public enum EMIStatus {
    PENDING("EMI payment is pending"),
    PAID("EMI payment has been made"),
    OVERDUE("EMI payment is overdue");

    private final String description;

    EMIStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
