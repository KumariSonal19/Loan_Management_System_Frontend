package com.lms.authservice.entity;

public enum Role {
    ADMIN("Admin User - Full System Access"),
    LOAN_OFFICER("Loan Officer - Can Review and Approve Loans"),
    CUSTOMER("Customer - Can Apply for Loans and View Status");

    private final String description;

    Role(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
