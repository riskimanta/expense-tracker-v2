package com.expensetracker.repo;

import com.expensetracker.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.date BETWEEN :from AND :to AND (:accountId IS NULL OR t.account.id = :accountId) ORDER BY t.date DESC, t.id DESC")
    List<Transaction> findRange(@Param("userId") Long userId, 
                                @Param("from") LocalDate from, 
                                @Param("to") LocalDate to, 
                                @Param("accountId") Long accountId);
    
    List<Transaction> findByUserIdAndType(Long userId, String type);
}
