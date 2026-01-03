package com.lms.notificationservice.controller;

import com.lms.notificationservice.dto.NotificationDTO;
import com.lms.notificationservice.dto.NotificationEventDTO;
import com.lms.notificationservice.entity.NotificationChannel;
import com.lms.notificationservice.entity.NotificationType;
import com.lms.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<Void> send(@RequestBody NotificationEventDTO event) {
        notificationService.sendNotification(event);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/send")
    public ResponseEntity<Void> sendNotificationFromFeign(@RequestParam Long userId,@RequestParam String type,@RequestParam String message,@RequestParam(required = false) Long loanId
    ) {
        NotificationEventDTO event = NotificationEventDTO.builder()
                .userId(userId)
                .loanApplicationId(loanId)
                .eventType(NotificationType.valueOf(type)) 
                .title("Loan Notification")
                .message(message)
                .channel(NotificationChannel.EMAIL) 
                .build();

        notificationService.sendNotification(event);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO>> getUserNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationDTO>> getUnread(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationDTO> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }
}