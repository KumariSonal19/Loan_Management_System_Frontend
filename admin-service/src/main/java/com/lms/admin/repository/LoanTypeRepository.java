package com.lms.admin.repository;

import com.lms.admin.entity.LoanType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanTypeRepository extends JpaRepository<LoanType, Long> {

    Optional<LoanType> findByTypeName(String typeName);

    List<LoanType> findByIsActiveTrue();

    Page<LoanType> findByIsActiveTrue(Pageable pageable);

    List<LoanType> findByIsActiveFalse();

    Page<LoanType> findAll(Pageable pageable);

    boolean existsByTypeNameAndIdNot(String typeName, Long id);
}
