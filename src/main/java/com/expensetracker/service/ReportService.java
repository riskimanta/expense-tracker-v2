package com.expensetracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Value("${app.db.vendor}")
    private String vendor;

    public List<Map<String, Object>> monthlyTotals(Long userId, LocalDate from, LocalDate to) {
        String sql;
        
        if ("sqlite".equals(vendor)) {
            sql = """
                SELECT substr(date,1,7) AS ym, 
                       SUM(CASE WHEN type IN ('INCOME','TRANSFER_IN') THEN amount ELSE -amount END) total 
                FROM transactions 
                WHERE user_id = ? AND date BETWEEN ? AND ? 
                GROUP BY ym 
                ORDER BY ym
                """;
        } else {
            sql = """
                SELECT to_char(date,'YYYY-MM') AS ym, 
                       SUM(CASE WHEN type IN ('INCOME','TRANSFER_IN') THEN amount ELSE -amount END) total 
                FROM transactions 
                WHERE user_id = ? AND date BETWEEN ? AND ? 
                GROUP BY ym 
                ORDER BY ym
                """;
        }
        
        return jdbcTemplate.queryForList(sql, userId, from.toString(), to.toString());
    }

    public List<Map<String, Object>> totalsByCategory(Long userId, LocalDate from, LocalDate to) {
        String sql;
        
        if ("sqlite".equals(vendor)) {
            sql = """
                SELECT c.type, c.name as category, 
                       SUM(CASE WHEN t.type = 'EXPENSE' THEN -t.amount ELSE 0 END) as total
                FROM transactions t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.user_id = ? AND t.date BETWEEN ? AND ? 
                  AND t.type = 'EXPENSE'
                GROUP BY c.type, c.name
                ORDER BY total DESC
                """;
        } else {
            sql = """
                SELECT c.type, c.name as category, 
                       SUM(CASE WHEN t.type = 'EXPENSE' THEN -t.amount ELSE 0 END) as total
                FROM transactions t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.user_id = ? AND t.date BETWEEN ? AND ? 
                  AND t.type = 'EXPENSE'
                GROUP BY c.type, c.name
                ORDER BY total DESC
                """;
        }
        
        return jdbcTemplate.queryForList(sql, userId, from.toString(), to.toString());
    }
}
