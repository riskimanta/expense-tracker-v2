package com.expensetracker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

public record AdvisorRequestDTO(
    @NotNull Long userId,
    @NotNull @DecimalMin("0.01") BigDecimal price,
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}") String targetDate,
    String priority
) {}
