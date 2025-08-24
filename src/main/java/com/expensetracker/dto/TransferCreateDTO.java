package com.expensetracker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

public record TransferCreateDTO(
    @NotNull Long userId,
    @NotNull Long fromAccountId,
    @NotNull Long toAccountId,
    @NotNull @DecimalMin("0.01") BigDecimal amount,
    @NotNull @DecimalMin("0.00") BigDecimal fee,
    @NotNull @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}") String date,
    String note
) {}
