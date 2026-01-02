package com.lms.admin.service;

import com.lms.admin.dto.LoanTypeDTO;
import com.lms.admin.entity.LoanType;
import com.lms.admin.repository.LoanTypeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class LoanTypeService {

    @Autowired
    private LoanTypeRepository loanTypeRepository;

    public List<LoanTypeDTO> getAllActiveLoanTypes() {
        log.info("Fetching all active loan types");
        return loanTypeRepository.findByIsActiveTrue()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<LoanTypeDTO> getAllLoanTypes() {
        List<LoanType> loanTypes = loanTypeRepository.findAll();
        return loanTypes.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public LoanTypeDTO getLoanTypeById(Long id) {
        log.info("Fetching loan type: {}", id);
        LoanType loanType = loanTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan type not found with ID: " + id));
        return mapToDTO(loanType);
    }

    public LoanTypeDTO getLoanTypeByName(String typeName) {
        log.info("Fetching loan type: {}", typeName);
        LoanType loanType = loanTypeRepository.findByTypeName(typeName)
                .orElseThrow(() -> new RuntimeException("Loan type not found: " + typeName));
        return mapToDTO(loanType);
    }

    public LoanTypeDTO createLoanType(LoanTypeDTO dto) {
        if (loanTypeRepository.findByTypeName(dto.getTypeName()).isPresent()) {
            throw new RuntimeException("Loan type already exists: " + dto.getTypeName());
        }

        if (dto.getMinTenure() >= dto.getMaxTenure()) {
            throw new RuntimeException("Minimum tenure must be less than maximum tenure");
        }

        if (dto.getMinAmount().compareTo(dto.getMaxAmount()) >= 0) {
            throw new RuntimeException("Minimum amount must be less than maximum amount");
        }

        LoanType loanType = mapToEntity(dto);
        LoanType saved = loanTypeRepository.save(loanType);
        log.info("Loan type created - ID: {}, Name: {}", saved.getId(), saved.getTypeName());
        return mapToDTO(saved);
    }

    public LoanTypeDTO updateLoanType(Long id, LoanTypeDTO dto) {
        LoanType loanType = loanTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan type not found"));

        if (!loanType.getTypeName().equals(dto.getTypeName()) &&
                loanTypeRepository.existsByTypeNameAndIdNot(dto.getTypeName(), id)) {
            throw new RuntimeException("Loan type name already exists: " + dto.getTypeName());
        }

        if (dto.getMinTenure() >= dto.getMaxTenure()) {
            throw new RuntimeException("Minimum tenure must be less than maximum tenure");
        }

        if (dto.getMinAmount().compareTo(dto.getMaxAmount()) >= 0) {
            throw new RuntimeException("Minimum amount must be less than maximum amount");
        }

        loanType.setTypeName(dto.getTypeName());
        loanType.setMinAmount(dto.getMinAmount());
        loanType.setMaxAmount(dto.getMaxAmount());
        loanType.setBaseInterestRate(dto.getBaseInterestRate());
        loanType.setMinTenure(dto.getMinTenure());
        loanType.setMaxTenure(dto.getMaxTenure());
        loanType.setDescription(dto.getDescription());

        LoanType updated = loanTypeRepository.save(loanType);
        log.info("Loan type updated - ID: {}", id);
        return mapToDTO(updated);
    }

    public LoanTypeDTO deactivateLoanType(Long id) {
        LoanType loanType = loanTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan type not found"));
        loanType.setIsActive(false);
        LoanType updated = loanTypeRepository.save(loanType);
        log.info("Loan type deactivated - ID: {}", id);
        return mapToDTO(updated);
    }

    public LoanTypeDTO activateLoanType(Long id) {
        LoanType loanType = loanTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan type not found"));
        loanType.setIsActive(true);
        LoanType updated = loanTypeRepository.save(loanType);
        log.info("Loan type activated - ID: {}", id);
        return mapToDTO(updated);
    }

    public void deleteLoanType(Long id) {
        if (!loanTypeRepository.existsById(id)) {
            throw new RuntimeException("Loan type not found");
        }
        loanTypeRepository.deleteById(id);
        log.info("Loan type deleted - ID: {}", id);
    }

    private LoanTypeDTO mapToDTO(LoanType loanType) {
        return LoanTypeDTO.builder()
                .id(loanType.getId())
                .typeName(loanType.getTypeName())
                .minAmount(loanType.getMinAmount())
                .maxAmount(loanType.getMaxAmount())
                .baseInterestRate(loanType.getBaseInterestRate())
                .minTenure(loanType.getMinTenure())
                .maxTenure(loanType.getMaxTenure())
                .description(loanType.getDescription())
                .isActive(loanType.getIsActive())
                .build();
    }

    private LoanType mapToEntity(LoanTypeDTO dto) {
        LoanType loanType = new LoanType();
        loanType.setTypeName(dto.getTypeName());
        loanType.setMinAmount(dto.getMinAmount());
        loanType.setMaxAmount(dto.getMaxAmount());
        loanType.setBaseInterestRate(dto.getBaseInterestRate());
        loanType.setMinTenure(dto.getMinTenure());
        loanType.setMaxTenure(dto.getMaxTenure());
        loanType.setDescription(dto.getDescription());
        loanType.setIsActive(true);
        return loanType;
    }
}
