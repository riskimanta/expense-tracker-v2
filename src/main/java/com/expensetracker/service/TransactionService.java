package com.expensetracker.service;

import com.expensetracker.dto.ExpenseCreateDTO;
import com.expensetracker.dto.IncomeCreateDTO;
import com.expensetracker.dto.TransferCreateDTO;
import com.expensetracker.entity.*;
import com.expensetracker.repo.AccountRepository;
import com.expensetracker.repo.CategoryRepository;
import com.expensetracker.repo.TransactionRepository;
import com.expensetracker.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;

    @Transactional
    public Transaction createExpense(ExpenseCreateDTO dto) {
        User user = userRepository.findById(dto.userId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Account account = accountRepository.findById(dto.accountId())
            .orElseThrow(() -> new RuntimeException("Account not found"));
        
        Category category = categoryRepository.findById(dto.categoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setAccount(account);
        transaction.setCategory(category);
        transaction.setType(TxType.EXPENSE);
        transaction.setDate(LocalDate.parse(dto.date()));
        transaction.setAmount(dto.amount().negate()); // Negative for expenses
        transaction.setNote(dto.note());
        transaction.setCreatedAt(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction createIncome(IncomeCreateDTO dto) {
        User user = userRepository.findById(dto.userId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Account account = accountRepository.findById(dto.accountId())
            .orElseThrow(() -> new RuntimeException("Account not found"));

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setAccount(account);
        transaction.setCategory(null); // Income can be without specific category
        transaction.setType(TxType.INCOME);
        transaction.setDate(LocalDate.parse(dto.date()));
        transaction.setAmount(dto.amount()); // Positive for income
        transaction.setNote(dto.note());
        transaction.setCreatedAt(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    @Transactional
    public TransferResult createTransfer(TransferCreateDTO dto) {
        User user = userRepository.findById(dto.userId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Account fromAccount = accountRepository.findById(dto.fromAccountId())
            .orElseThrow(() -> new RuntimeException("From account not found"));
        
        Account toAccount = accountRepository.findById(dto.toAccountId())
            .orElseThrow(() -> new RuntimeException("To account not found"));

        String transferGroup = UUID.randomUUID().toString();

        // Create TRANSFER_OUT transaction
        Transaction transferOut = new Transaction();
        transferOut.setUser(user);
        transferOut.setAccount(fromAccount);
        transferOut.setCategory(null);
        transferOut.setType(TxType.TRANSFER_OUT);
        transferOut.setDate(LocalDate.parse(dto.date()));
        transferOut.setAmount(dto.amount().negate()); // Negative for outgoing
        transferOut.setNote(dto.note());
        transferOut.setTransferGroup(transferGroup);
        transferOut.setCreatedAt(LocalDateTime.now());

        // Create TRANSFER_IN transaction
        Transaction transferIn = new Transaction();
        transferIn.setUser(user);
        transferIn.setAccount(toAccount);
        transferIn.setCategory(null);
        transferIn.setType(TxType.TRANSFER_IN);
        transferIn.setDate(LocalDate.parse(dto.date()));
        transferIn.setAmount(dto.amount()); // Positive for incoming
        transferIn.setNote(dto.note());
        transferIn.setTransferGroup(transferGroup);
        transferIn.setCreatedAt(LocalDateTime.now());

        // Save both transactions
        Transaction savedOut = transactionRepository.save(transferOut);
        Transaction savedIn = transactionRepository.save(transferIn);

        // If there's a fee, create an additional expense transaction
        if (dto.fee().compareTo(BigDecimal.ZERO) > 0) {
            Transaction feeTransaction = new Transaction();
            feeTransaction.setUser(user);
            feeTransaction.setAccount(fromAccount);
            feeTransaction.setCategory(null);
            feeTransaction.setType(TxType.EXPENSE);
            feeTransaction.setDate(LocalDate.parse(dto.date()));
            feeTransaction.setAmount(dto.fee().negate()); // Negative for expense
            feeTransaction.setNote("Transfer fee");
            feeTransaction.setTransferGroup(transferGroup);
            feeTransaction.setCreatedAt(LocalDateTime.now());
            
            transactionRepository.save(feeTransaction);
        }

        return new TransferResult(savedOut, savedIn);
    }

    public record TransferResult(Transaction transferOut, Transaction transferIn) {}
}
