package com.lms.authservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.authservice.dto.LoginRequestDTO;
import com.lms.authservice.dto.LoginResponseDTO;
import com.lms.authservice.dto.RegisterRequestDTO;
import com.lms.authservice.dto.UserProfileDTO;
import com.lms.authservice.filter.JwtAuthenticationFilter;
import com.lms.authservice.service.AuthService;
import com.lms.authservice.util.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    private RegisterRequestDTO registerRequest;
    private LoginRequestDTO loginRequest;
    private LoginResponseDTO loginResponse;
    private UserProfileDTO userProfile;

    @BeforeEach
    void setUp() throws Exception {
    	doAnswer(invocation -> {
            HttpServletRequest request = invocation.getArgument(0);
            HttpServletResponse response = invocation.getArgument(1);
            FilterChain chain = invocation.getArgument(2);
            chain.doFilter(request, response);
            return null;
        }).when(jwtAuthenticationFilter).doFilter(any(), any(), any());

        registerRequest = new RegisterRequestDTO();
        registerRequest.setUsername("testuser");
        registerRequest.setPassword("Password123");
        registerRequest.setEmail("test@test.com");
        registerRequest.setFullName("Test User");
        registerRequest.setRole("CUSTOMER");
        registerRequest.setPhoneNumber("9876543210");

        loginRequest = new LoginRequestDTO();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("Password@123");

        loginResponse = LoginResponseDTO.builder()
                .accessToken("mock-jwt-token")
                .username("testuser")
                .build();

        userProfile = UserProfileDTO.builder()
                .userId(1L)
                .username("testuser")
                .email("test@test.com")
                .build();
    }

    @Test
    @WithMockUser
    void login_ShouldReturnToken() throws Exception {
        when(authService.login(any(LoginRequestDTO.class))).thenReturn(loginResponse);

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("mock-jwt-token"));
    }

    @Test
    @WithMockUser
    void getUserProfile_ShouldReturnProfile() throws Exception {
        when(authService.getUserProfile(1L)).thenReturn(userProfile);

        mockMvc.perform(get("/api/auth/profile/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@test.com"));
    }

}
