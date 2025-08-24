package com.expensetracker.web;

import com.expensetracker.entity.Account;
import com.expensetracker.repo.AccountRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@Tag(name = "Accounts", description = "Account management endpoints")
public class AccountsController {

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping
    @Operation(summary = "Get all accounts", description = "Retrieve all accounts for the default user")
    public List<Account> getAllAccounts() {
        // For now, return all accounts (user=1 default)
        // In a real app, this would filter by authenticated user
        return accountRepository.findByUserId(1L);
    }
}
