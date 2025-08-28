import { test, expect } from '@playwright/test'

test.describe('Currency Input Tests', () => {
  test('should format currency input correctly', async ({ page }) => {
    await page.goto('/expenses')
    
    // Wait for form to load
    await expect(page.getByTestId('amount-input')).toBeVisible()
    
    // Clear and type amount
    await page.getByTestId('amount-input').clear()
    await page.getByTestId('amount-input').type('50000')
    
    // Check if input value is formatted correctly
    // The exact format depends on the CurrencyInput component implementation
    const inputValue = await page.getByTestId('amount-input').inputValue()
    
    // Should contain the formatted value (either "50.000" or "Rp 50.000")
    expect(inputValue).toMatch(/^(Rp\s)?50\.000$/)
    
    // Test with different amounts
    await page.getByTestId('amount-input').clear()
    await page.getByTestId('amount-input').type('1000000')
    
    const inputValue2 = await page.getByTestId('amount-input').inputValue()
    expect(inputValue2).toMatch(/^(Rp\s)?1\.000\.000$/)
  })

  test('should handle currency input in form submission', async ({ page }) => {
    await page.goto('/expenses')
    
    // Wait for form to load
    await expect(page.getByTestId('amount-input')).toBeVisible()
    
    // Fill in required fields
    await page.getByTestId('tx-date').fill('2025-01-20')
    await page.getByTestId('tx-category').click()
    await page.getByText('Makanan').click()
    await page.getByTestId('tx-account').click()
    await page.getByText('Cash').click()
    await page.getByTestId('tx-note').fill('Test transaction')
    
    // Set amount
    await page.getByTestId('amount-input').clear()
    await page.getByTestId('amount-input').type('50000')
    
    // Submit form
    await page.getByTestId('tx-submit').click()
    
    // Check if form submission was successful (no validation errors)
    await expect(page.getByText('Error')).not.toBeVisible()
  })
})
