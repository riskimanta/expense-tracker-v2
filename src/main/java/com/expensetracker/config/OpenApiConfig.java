package com.expensetracker.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI expenseTrackerOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Expense Tracker API")
                .description("Backend API for Expense Tracker application")
                .version("1.0.0")
                .contact(new Contact()
                    .name("Expense Tracker Team")
                    .email("support@expensetracker.com"))
            );
    }
}
