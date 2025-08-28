import { test, expect } from '@playwright/test'

test.describe('Filter and Period Tests', () => {
  test('should change period and show correct subtitle', async ({ page }) => {
    await page.goto('/')
    
    // Get current month and year
    const now = new Date()
    const currentMonth = now.toLocaleDateString('id-ID', { month: 'long' })
    const currentYear = now.getFullYear()
    
    // Check initial subtitle
    await expect(page.getByText(`Ringkasan keuangan bulan ${currentMonth} ${currentYear}`)).toBeVisible()
    
    // Click on period trigger
    await page.getByTestId('period-trigger').click()
    
    // Select January of current year
    await page.getByText('Jan').click()
    
    // Check if subtitle changed to January
    await expect(page.getByText(`Ringkasan keuangan bulan Januari ${currentYear}`)).toBeVisible()
  })

  test('should filter by account', async ({ page }) => {
    await page.goto('/')
    
    // Check if account filter is present
    await expect(page.getByTestId('account-select')).toBeVisible()
    
    // Click on account filter
    await page.getByTestId('account-select').click()
    
    // Select BCA account
    await page.getByText('BCA').click()
    
    // Verify selection (this might need adjustment based on actual implementation)
    await expect(page.getByTestId('account-select')).toContainText('BCA')
  })

  test('should filter by category', async ({ page }) => {
    await page.goto('/expenses')
    
    // Check if category filter is present
    await expect(page.getByTestId('category-select')).toBeVisible()
    
    // Click on category filter
    await page.getByTestId('category-select').click()
    
    // Select "Makanan" category
    await page.getByText('Makanan').click()
    
    // Verify selection
    await expect(page.getByTestId('category-select')).toContainText('Makanan')
  })
})
