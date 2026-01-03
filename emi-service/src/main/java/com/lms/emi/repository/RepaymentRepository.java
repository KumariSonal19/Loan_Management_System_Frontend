package com.lms.emi.repository;

import com.lms.emi.entity.Repayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepaymentRepository extends JpaRepository<Repayment, Long> {

    List<Repayment> findByEmiScheduleId(Long emiScheduleId);

    long countByEmiScheduleId(Long emiScheduleId);
}
