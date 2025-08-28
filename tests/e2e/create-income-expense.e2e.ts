import { test, expect } from '@playwright/test'

test.describe('Create Income and Expense Tests', () => {
  test('should create income transaction and show in table', async ({ page }) => {
    await page.goto('/expenses')
    
    // Wait for form to load
    await expect(page.getByTestId('tx-date')).toBeVisible()
    
    // Fill in income form
    await page.getByTestId('tx-date').fill('2025-01-20')
    await page.getByTestId('tx-category').click()
    await page.getByText('Lainnya').click()
    await page.getByTestId('tx-account').click()
    await page.getByText('BCA').click()
    await page.getByTestId('amount-input').clear()
    await page.getByTestId('amount-input').type('1500000')
    await page.getByTestId('tx-note').fill('Gaji bulanan')
    
    // Submit form
    await page.getByTestId('tx-submit').click()
    
    // Wait for success message
    await expect(page.getByText('Sukses!')).toBeVisible()
    
    // Check if transaction appears in table
    await expect(page.getByTestId('tx-table')).toBeVisible()
    await expect(page.getByText('1.500.000')).toBeVisible()
    
    // Reload page to ensure data persistence
    await page.reload()
    
    // Check if transaction still exists
    await expect(page.getByTestId('tx-table')).toBeVisible()
    await expect(page.getByText('1.500.000')).toBeVisible()
  })

  test('should create expense transaction and update table', async ({ page }) => {
    await page.goto('/expenses')
    
    // Wait for form to load
    await expect(page.getByTestId('tx-date')).toBeVisible()
    
    // Fill in expense form
    await page.getByTestId('tx-date').fill('2025-01-21')
    await page.getByTestId('tx-category').click()
    await page.getByText('Makanan').click()
    await page.getByTestId('tx-account').click()
    await page.getByText('Cash').click()
    await page.getByTestId('amount-input').clear()
    await page.getByTestId('amount-input').type('200000')
    await page.getByTestId('tx-note').fill('Makan siang')
    
    // Submit form
    await page.getByTestId('tx-submit').click()
    
    // Wait for success message
    await expect(page.getByText('Sukses!')).toBeVisible()
    
    // Check if both transactions are in table
    await expect(page.getByText('1.500.000')).toBeVisible()
    await expect(page.getByText('200.000')).toBeVisible()
    
    // Check if cumulative amounts are correct
    const rows = page.getByTestId('tx-row')
    await expect(rows).toHaveCount(2)
  })

  test('should show transaction details correctly', async ({ page }) => {
    await page.goto('/expenses')
    
    // Wait for table to load
    await expect(page.getByTestId('tx-table')).toBeVisible()
    
    // Check if transaction details are displayed correctly
    await expect(page.getByText('Makanan')).toBeVisible()
    await expect(page.getByText('Makan siang')).toBeVisible()
    await expect(page.getByText('Cash')).toBeVisible()
  })
})
