package com.lms.notificationservice.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    private Long id;
    private Long userId;
    private Long loanApplicationId;
    private String type;
    private String title;
    private String message;
    private String notificationChannel;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
