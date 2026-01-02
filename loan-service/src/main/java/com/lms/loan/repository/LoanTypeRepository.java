package com.lms.loan.repository;

import com.lms.loan.entity.LoanType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanTypeRepository extends JpaRepository<LoanType, Long> {

    Optional<LoanType> findByTypeName(String typeName);

    List<LoanType> findByIsActiveTrue();
}
