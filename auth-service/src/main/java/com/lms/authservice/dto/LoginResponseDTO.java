package com.lms.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {

    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private String role;

    private String accessToken;
//    private String tokenType = "Bearer";
    private Long expiresIn;
}
