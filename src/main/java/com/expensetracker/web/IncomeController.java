package com.expensetracker.web;

import com.expensetracker.dto.IncomeCreateDTO;
import com.expensetracker.entity.Transaction;
import com.expensetracker.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/income")
@Tag(name = "Income", description = "Income management endpoints")
public class IncomeController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create income", description = "Create a new income transaction")
    public Transaction createIncome(@Valid @RequestBody IncomeCreateDTO dto) {
        return transactionService.createIncome(dto);
    }
}
