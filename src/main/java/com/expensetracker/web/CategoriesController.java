package com.expensetracker.web;

import com.expensetracker.entity.Category;
import com.expensetracker.repo.CategoryRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@Tag(name = "Categories", description = "Category management endpoints")
public class CategoriesController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    @Operation(summary = "Get all categories", description = "Retrieve all categories for the default user")
    public List<Category> getAllCategories() {
        // For now, return all categories (user=1 default)
        // In a real app, this would filter by authenticated user
        return categoryRepository.findByUserId(1L);
    }
}
