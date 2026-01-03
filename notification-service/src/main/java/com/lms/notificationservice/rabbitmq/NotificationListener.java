package com.lms.notificationservice.rabbitmq;

import com.lms.notificationservice.config.NotificationConfig;
import com.lms.notificationservice.event.NotificationEvent;
import com.lms.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class NotificationListener {

    private final NotificationService notificationService;

    @RabbitListener(queues = NotificationConfig.QUEUE_NAME)
    public void handleNotification(NotificationEvent event) {
        log.info("Received RabbitMQ Event: {}", event);
        
        notificationService.processNotification(event); 
    }
}