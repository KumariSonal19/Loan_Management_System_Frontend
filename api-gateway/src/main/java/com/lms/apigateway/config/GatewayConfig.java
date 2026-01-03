package com.lms.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class GatewayConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        return http
              
                .csrf(csrf -> csrf.disable())
                
                .cors(cors -> cors.disable())
                
                .authorizeExchange(exchange -> exchange
                        .anyExchange().permitAll() 
                )
                .build();
    }
}