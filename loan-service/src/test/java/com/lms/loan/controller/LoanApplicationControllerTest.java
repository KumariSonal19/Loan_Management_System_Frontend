package com.lms.loan.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.loan.dto.LoanApplicationDTO;
import com.lms.loan.dto.LoanApprovalRequestDTO;
import com.lms.loan.entity.LoanStatus;
import com.lms.loan.service.LoanApplicationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = LoanApplicationController.class)
@AutoConfigureMockMvc(addFilters = false)
class LoanApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LoanApplicationService loanApplicationService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void applyLoan_success() throws Exception {
        LoanApplicationDTO dto = new LoanApplicationDTO();
        dto.setLoanAmount(BigDecimal.valueOf(50000));
        dto.setTenure(12);

        when(loanApplicationService.applyLoan(any(), any())).thenReturn(dto);

        mockMvc.perform(post("/api/loans/apply")
                        .header("X-User-Id", "1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());
    }

    @Test
    void getLoanById_success() throws Exception {
        LoanApplicationDTO dto = new LoanApplicationDTO();
        dto.setId(1L);

        when(loanApplicationService.getLoanById(1L)).thenReturn(dto);

        mockMvc.perform(get("/api/loans/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void getLoansByCustomer_success() throws Exception {
        when(loanApplicationService.getCustomerLoans(1L))
                .thenReturn(List.of(new LoanApplicationDTO()));

        mockMvc.perform(get("/api/loans/customer/list/1"))
                .andExpect(status().isOk());
    }

    @Test
    void updateLoanStatus_success() throws Exception {
        LoanApprovalRequestDTO req = new LoanApprovalRequestDTO();
        req.setLoanId(1L);
        req.setStatus("APPROVED");

        when(loanApplicationService.updateLoanStatus(any(), any()))
                .thenReturn(new LoanApplicationDTO());

        mockMvc.perform(put("/api/loans/review")
                        .header("X-User-Id", "10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    void healthCheck() throws Exception {
        mockMvc.perform(get("/api/loans/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("Loan Service is running"));
    }
}
