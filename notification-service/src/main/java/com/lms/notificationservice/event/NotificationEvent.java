package com.lms.notificationservice.event;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationEvent {
    private Long userId;
    private Long loanId;
    private String userEmail; 
    private String type;      
    private String title;
    private String message;
}