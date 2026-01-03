package com.lms.notificationservice.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SmsService {

    @Value("${twilio.account-sid:AC_DUMMY}") 
    private String accountSid;

    @Value("${twilio.auth-token:TOKEN_DUMMY}")
    private String authToken;

    @Value("${twilio.phone-number:+15005550006}")
    private String fromNumber;

    private boolean isEnabled = false;

    @PostConstruct
    public void init() {
        
        if ("AC_DUMMY".equals(accountSid) || "TOKEN_DUMMY".equals(authToken)) {
            log.warn("⚠️ Twilio credentials missing. SMS Service will be DISABLED.");
            this.isEnabled = false;
            return;
        }

        try {
            Twilio.init(accountSid, authToken);
            this.isEnabled = true;
            log.info("Twilio SMS Service Initialized successfully.");
        } catch (Exception e) {
            log.error("Failed to initialize Twilio: {}", e.getMessage());
            this.isEnabled = false;
        }
    }

    public void sendSms(Long userId, String messageBody) {
        if (!isEnabled) {
            log.warn("SMS skipped (Service Disabled): {}", messageBody);
            return;
        }

        try {
            
            String toPhone = "+919999999999"; 

            Message.creator(
                    new PhoneNumber(toPhone),
                    new PhoneNumber(fromNumber),
                    messageBody
            ).create();
            
            log.info("SMS sent to user {}", userId);
        } catch (Exception e) {
            log.error("Failed to send SMS: {}", e.getMessage());
        }
    }
}
