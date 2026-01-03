package com.lms.notificationservice.dto;

import com.lms.notificationservice.entity.NotificationChannel;
import com.lms.notificationservice.entity.NotificationType;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationEventDTO {
    private Long userId;
    private Long loanApplicationId;
    private NotificationType eventType;
    private String title;
    private String message;
    private NotificationChannel channel;
}
