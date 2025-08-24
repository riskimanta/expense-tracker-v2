package com.expensetracker.dto;

import java.math.BigDecimal;
import java.util.List;

public record AdvisorResponseDTO(
    boolean canBuyToday,
    String earliestDate,
    BigDecimal safeToSpendToday,
    List<String> notes
) {}
