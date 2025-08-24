package com.expensetracker.web;

import com.expensetracker.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports", description = "Financial reporting endpoints")
public class ReportsController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/monthly")
    @Operation(summary = "Get monthly totals", description = "Retrieve monthly financial totals")
    public List<Map<String, Object>> getMonthlyTotals(
            @RequestParam(defaultValue = "1") Long userId,
            @RequestParam String from,
            @RequestParam String to) {
        
        LocalDate fromDate = LocalDate.parse(from);
        LocalDate toDate = LocalDate.parse(to);
        
        return reportService.monthlyTotals(userId, fromDate, toDate);
    }

    @GetMapping("/by-category")
    @Operation(summary = "Get totals by category", description = "Retrieve financial totals grouped by category")
    public List<Map<String, Object>> getTotalsByCategory(
            @RequestParam(defaultValue = "1") Long userId,
            @RequestParam String from,
            @RequestParam String to) {
        
        LocalDate fromDate = LocalDate.parse(from);
        LocalDate toDate = LocalDate.parse(to);
        
        return reportService.totalsByCategory(userId, fromDate, toDate);
    }
}
