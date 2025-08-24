package com.expensetracker.web;

import com.expensetracker.dto.AdvisorRequestDTO;
import com.expensetracker.dto.AdvisorResponseDTO;
import com.expensetracker.service.AdvisorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/advisor")
@Tag(name = "Financial Advisor", description = "Financial advice endpoints")
public class AdvisorController {

    @Autowired
    private AdvisorService advisorService;

    @PostMapping("/can-buy")
    @Operation(summary = "Check if can buy", description = "Get financial advice on whether a purchase is safe")
    public AdvisorResponseDTO canBuy(@Valid @RequestBody AdvisorRequestDTO request) {
        return advisorService.compute(request);
    }
}
