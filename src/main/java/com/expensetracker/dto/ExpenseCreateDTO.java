package com.expensetracker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

public record ExpenseCreateDTO(
    @NotNull Long userId,
    @NotNull Long accountId,
    @NotNull Long categoryId,
    @NotNull @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}") String date,
    @NotNull @DecimalMin("0.01") BigDecimal amount,
    String note
) {}
