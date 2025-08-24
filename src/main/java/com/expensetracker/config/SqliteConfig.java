package com.expensetracker.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
@Profile("dev")
public class SqliteConfig {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void enableForeignKeys() {
        jdbcTemplate.execute("PRAGMA foreign_keys=ON");
    }
}
