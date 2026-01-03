package com.lms.loan.client;

import com.lms.loan.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "auth-service") 
public interface UserClient {

    @GetMapping("/api/auth/profile/{id}") 
    UserDTO getUserById(@PathVariable("id") Long id);
}