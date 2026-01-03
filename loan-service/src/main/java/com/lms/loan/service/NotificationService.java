package com.lms.loan.service;

import com.lms.loan.dto.NotificationDTO;
import com.lms.loan.config.NotificationConfig; // Ensure this import is correct
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendNotification(Long userId, Long loanId, String userEmail, String type, String title, String message) {
        
        NotificationDTO notification = NotificationDTO.builder()
                .userId(userId)
                .loanId(loanId)
                .userEmail(userEmail) 
                .type(type)
                .title(title)
                .message(message)
                .build();
        
        rabbitTemplate.convertAndSend(
            NotificationConfig.EXCHANGE_NAME, 
            NotificationConfig.ROUTING_KEY, 
            notification
        );
        
        System.out.println("Message sent to RabbitMQ for User: " + userId);
    }
}