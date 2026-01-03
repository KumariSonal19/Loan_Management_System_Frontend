package com.lms.loan.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class NotificationClientFallback implements NotificationClient {

    @Override
    public void sendLoanNotification(Long userId, String type, String message, Long loanId) {
        log.warn("Notification service is down. Message would have been: {} to user: {}", message, userId);
    }
}
