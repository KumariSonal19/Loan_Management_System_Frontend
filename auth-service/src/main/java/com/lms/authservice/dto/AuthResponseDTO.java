package com.lms.authservice.dto;

import com.lms.authservice.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponseDTO {

    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private Role role;
    private String accessToken;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private Boolean isActive;
    private String message;
}
