package com.lms.loan.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "notification-service", fallback = NotificationClientFallback.class)
public interface NotificationClient {

    @PostMapping("/api/notifications/send")
    void sendLoanNotification(
            @RequestParam Long userId,
            @RequestParam String type,
            @RequestParam String message,
            @RequestParam(required = false) Long loanId
    );
}
