import { test, expect } from '@playwright/test'

test.describe('Smoke Tests', () => {
  test('should load dashboard and show charts', async ({ page }) => {
    await page.goto('/')
    
    // Check if dashboard loads
    await expect(page.getByRole('heading', { name: 'Dashboard Summary' })).toBeVisible()
    
    // Check if chart containers are visible
    await expect(page.getByTestId('chart-daily')).toBeVisible()
    await expect(page.getByTestId('chart-donut')).toBeVisible()
    
    // Check if KPIs are displayed
    await expect(page.getByText(/Rp/)).toBeVisible()
  })

  test('should load expenses page', async ({ page }) => {
    await page.goto('/expenses')
    
    // Check if expenses page loads
    await expect(page.getByRole('heading', { name: 'Pengeluaran' })).toBeVisible()
    
    // Check if transaction table is present
    await expect(page.getByTestId('tx-table')).toBeVisible()
    
    // Check if form elements are present
    await expect(page.getByTestId('tx-date')).toBeVisible()
    await expect(page.getByTestId('tx-category')).toBeVisible()
    await expect(page.getByTestId('amount-input')).toBeVisible()
    await expect(page.getByTestId('tx-account')).toBeVisible()
    await expect(page.getByTestId('tx-note')).toBeVisible()
    await expect(page.getByTestId('tx-submit')).toBeVisible()
  })
})
