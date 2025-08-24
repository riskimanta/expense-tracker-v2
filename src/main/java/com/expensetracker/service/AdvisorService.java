package com.expensetracker.service;

import com.expensetracker.dto.AdvisorRequestDTO;
import com.expensetracker.dto.AdvisorResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AdvisorService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public AdvisorResponseDTO compute(AdvisorRequestDTO request) {
        Long userId = request.userId();
        BigDecimal price = request.price();
        
        // Get current month's income
        YearMonth currentMonth = YearMonth.now();
        LocalDate monthStart = currentMonth.atDay(1);
        LocalDate monthEnd = currentMonth.atEndOfMonth();
        
        BigDecimal incomeMonth = getMonthlyIncome(userId, monthStart, monthEnd);
        
        // Get spent to date (current month)
        LocalDate today = LocalDate.now();
        BigDecimal spentToDate = getSpentToDate(userId, monthStart, today);
        
        // Calculate daily burn rate (last 30 days)
        LocalDate thirtyDaysAgo = today.minusDays(30);
        BigDecimal dailyBurn = getDailyBurnRate(userId, thirtyDaysAgo, today);
        
        // Calculate days left in month
        int daysLeft = monthEnd.getDayOfYear() - today.getDayOfYear();
        
        // Calculate buffer (10% of daily burn * days left)
        BigDecimal buffer = dailyBurn.multiply(BigDecimal.valueOf(daysLeft))
            .multiply(BigDecimal.valueOf(0.1))
            .setScale(2, RoundingMode.HALF_UP);
        
        // Calculate safe to spend today
        BigDecimal safeToSpendToday = incomeMonth
            .subtract(spentToDate)
            .subtract(dailyBurn.multiply(BigDecimal.valueOf(daysLeft)))
            .subtract(buffer);
        
        // Determine if can buy today
        boolean canBuyToday = safeToSpendToday.compareTo(price) >= 0;
        
        // Calculate earliest date
        String earliestDate;
        if (canBuyToday) {
            earliestDate = today.toString();
        } else {
            // Set to 25th of current/next month (payday placeholder)
            YearMonth nextMonth = currentMonth.plusMonths(1);
            earliestDate = nextMonth.atDay(25).toString();
        }
        
        // Generate notes
        List<String> notes = generateNotes(incomeMonth, spentToDate, dailyBurn, daysLeft, buffer, safeToSpendToday, price);
        
        return new AdvisorResponseDTO(canBuyToday, earliestDate, safeToSpendToday, notes);
    }
    
    private BigDecimal getMonthlyIncome(Long userId, LocalDate from, LocalDate to) {
        String sql = """
            SELECT COALESCE(SUM(amount), 0) as total
            FROM transactions 
            WHERE user_id = ? AND date BETWEEN ? AND ? 
              AND type IN ('INCOME', 'TRANSFER_IN')
            """;
        
        Map<String, Object> result = jdbcTemplate.queryForMap(sql, userId, from.toString(), to.toString());
        return new BigDecimal(result.get("total").toString());
    }
    
    private BigDecimal getSpentToDate(Long userId, LocalDate from, LocalDate to) {
        String sql = """
            SELECT COALESCE(SUM(CASE WHEN type IN ('EXPENSE', 'TRANSFER_OUT') THEN -amount ELSE 0 END), 0) as total
            FROM transactions 
            WHERE user_id = ? AND date BETWEEN ? AND ? 
              AND type IN ('EXPENSE', 'TRANSFER_OUT')
            """;
        
        Map<String, Object> result = jdbcTemplate.queryForMap(sql, userId, from.toString(), to.toString());
        return new BigDecimal(result.get("total").toString());
    }
    
    private BigDecimal getDailyBurnRate(Long userId, LocalDate from, LocalDate to) {
        String sql = """
            SELECT COALESCE(AVG(CASE WHEN type IN ('EXPENSE', 'TRANSFER_OUT') THEN -amount ELSE 0 END), 0) as avg_daily
            FROM transactions 
            WHERE user_id = ? AND date BETWEEN ? AND ? 
              AND type IN ('EXPENSE', 'TRANSFER_OUT')
            """;
        
        Map<String, Object> result = jdbcTemplate.queryForMap(sql, userId, from.toString(), to.toString());
        return new BigDecimal(result.get("avg_daily").toString());
    }
    
    private List<String> generateNotes(BigDecimal incomeMonth, BigDecimal spentToDate, 
                                     BigDecimal dailyBurn, int daysLeft, BigDecimal buffer,
                                     BigDecimal safeToSpendToday, BigDecimal price) {
        List<String> notes = new ArrayList<>();
        
        notes.add("Monthly income: " + incomeMonth);
        notes.add("Spent to date: " + spentToDate);
        notes.add("Daily burn rate: " + dailyBurn);
        notes.add("Days left in month: " + daysLeft);
        notes.add("Buffer (10%): " + buffer);
        notes.add("Safe to spend today: " + safeToSpendToday);
        
        if (safeToSpendToday.compareTo(price) >= 0) {
            notes.add("Purchase is safe to make today");
        } else {
            notes.add("Consider waiting until next payday");
        }
        
        return notes;
    }
}
