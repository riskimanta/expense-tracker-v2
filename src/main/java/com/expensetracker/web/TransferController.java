package com.expensetracker.web;

import com.expensetracker.dto.TransferCreateDTO;
import com.expensetracker.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transfer")
@Tag(name = "Transfer", description = "Transfer management endpoints")
public class TransferController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create transfer", description = "Create a new transfer between accounts")
    public TransactionService.TransferResult createTransfer(@Valid @RequestBody TransferCreateDTO dto) {
        return transactionService.createTransfer(dto);
    }
}
