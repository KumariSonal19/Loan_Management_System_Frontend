package com.lms.notificationservice.service;

import com.lms.notificationservice.dto.NotificationDTO;
import com.lms.notificationservice.dto.NotificationEventDTO;
import com.lms.notificationservice.entity.Notification;
import com.lms.notificationservice.entity.NotificationChannel;
import com.lms.notificationservice.entity.NotificationType;
import com.lms.notificationservice.event.NotificationEvent;
import com.lms.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;
    private final SmsService smsService;

    public void sendNotification(NotificationEventDTO event) {
        Notification notification = Notification.builder()
                .userId(event.getUserId())
                .loanApplicationId(event.getLoanApplicationId())
                .type(event.getEventType())
                .title(event.getTitle())
                .message(event.getMessage())
                .notificationChannel(event.getChannel())
                .isRead(false)
                .build();

        notificationRepository.save(notification);

        switch (event.getChannel()) {
            case EMAIL -> {
                String tempEmail = "user" + event.getUserId() + "@example.com";
                emailService.sendEmail(tempEmail, event.getTitle(), event.getMessage());
            }
            case SMS -> smsService.sendSms(event.getUserId(), event.getMessage());
            default -> {
            }
        }
    }

    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public NotificationDTO markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        return toDTO(notificationRepository.save(notification));
    }

    private NotificationDTO toDTO(Notification n) {
        return NotificationDTO.builder()
                .id(n.getId())
                .userId(n.getUserId())
                .loanApplicationId(n.getLoanApplicationId())
                .type(n.getType().name())
                .title(n.getTitle())
                .message(n.getMessage())
                .notificationChannel(n.getNotificationChannel().name())
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt())
                .build();
    }

    public void processNotification(NotificationEvent event) {
        Notification notification = Notification.builder()
                .userId(event.getUserId())
                .loanApplicationId(event.getLoanId())
                .type(NotificationType.valueOf(event.getType()))
                .title(event.getTitle())
                .message(event.getMessage())
                .notificationChannel(NotificationChannel.EMAIL)
                .isRead(false)
                .build();

        notificationRepository.save(notification);

        if (event.getUserEmail() != null && !event.getUserEmail().isEmpty()) {
            emailService.sendEmail(event.getUserEmail(), event.getTitle(), event.getMessage());
        } else {
            log.warn("Notification saved, but no email address found for User ID: {}", event.getUserId());
        }
    }
}
