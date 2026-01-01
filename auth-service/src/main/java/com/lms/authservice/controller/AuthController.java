package com.lms.authservice.controller;

import com.lms.authservice.dto.AuthResponseDTO;
import com.lms.authservice.dto.LoginRequestDTO;
import com.lms.authservice.dto.RegisterRequestDTO;
import com.lms.authservice.entity.User;
import com.lms.authservice.service.AuthService;
import com.lms.authservice.util.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@Slf4j
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        log.info("Register request for user: {}", request.getUsername());
        AuthResponseDTO response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        log.info("Login request for user: {}", request.getUsername());
        AuthResponseDTO response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        boolean isValid = authService.validateToken(token);
        return ResponseEntity.ok(isValid);
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<AuthResponseDTO> getUserProfile(@PathVariable Long id) {
        Optional<User> user = authService.getUserById(id);
        if (user.isPresent()) {
            AuthResponseDTO response = AuthResponseDTO.builder()
                    .userId(user.get().getId())
                    .username(user.get().getUsername())
                    .email(user.get().getEmail())
                    .fullName(user.get().getFullName())
                    .role(user.get().getRole())
                    .isActive(user.get().getIsActive())
                    .message("User profile retrieved")
                    .build();
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<AuthResponseDTO> updateUserProfile(
            @PathVariable Long id,
            @Valid @RequestBody RegisterRequestDTO request) {
        User updatedUser = authService.updateUser(id, request);
        AuthResponseDTO response = AuthResponseDTO.builder()
                .userId(updatedUser.getId())
                .username(updatedUser.getUsername())
                .email(updatedUser.getEmail())
                .fullName(updatedUser.getFullName())
                .role(updatedUser.getRole())
                .isActive(updatedUser.getIsActive())
                .message("User profile updated successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth Service is running");
    }
}
