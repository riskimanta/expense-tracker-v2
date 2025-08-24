package com.expensetracker.web;

import com.expensetracker.dto.ExpenseCreateDTO;
import com.expensetracker.entity.Transaction;
import com.expensetracker.repo.TransactionRepository;
import com.expensetracker.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@Tag(name = "Expenses", description = "Expense management endpoints")
public class TransactionsController {

    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private TransactionService transactionService;

    @GetMapping
    @Operation(summary = "Get expenses", description = "Retrieve expenses with optional filtering")
    public List<Transaction> getExpenses(
            @RequestParam(defaultValue = "1") Long userId,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) Long accountId) {
        
        LocalDate fromDate = from != null ? LocalDate.parse(from) : LocalDate.now().minusMonths(1);
        LocalDate toDate = to != null ? LocalDate.parse(to) : LocalDate.now();
        
        if (accountId != null) {
            return transactionRepository.findRange(userId, fromDate, toDate, accountId);
        } else {
            return transactionRepository.findRange(userId, fromDate, toDate, null);
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create expense", description = "Create a new expense transaction")
    public Transaction createExpense(@Valid @RequestBody ExpenseCreateDTO dto) {
        return transactionService.createExpense(dto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete expense", description = "Delete an expense transaction by ID")
    public void deleteExpense(@PathVariable Long id) {
        transactionRepository.deleteById(id);
    }
}
