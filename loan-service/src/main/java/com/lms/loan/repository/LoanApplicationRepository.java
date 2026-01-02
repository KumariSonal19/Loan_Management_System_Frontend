package com.lms.loan.repository;

import com.lms.loan.entity.LoanApplication;
import com.lms.loan.entity.LoanStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {

	List<LoanApplication> findByCustomerId(Long customerId);

    List<LoanApplication> findByStatus(LoanStatus status);

    Long countByStatus(LoanStatus status);

    List<LoanApplication> findByCustomerIdAndStatus(Long customerId, LoanStatus status);

    Optional<LoanApplication> findByIdAndCustomerId(Long loanId, Long customerId);
    
}