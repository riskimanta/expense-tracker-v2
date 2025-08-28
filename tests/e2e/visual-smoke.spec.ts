import { test, expect } from '@playwright/test'

test.describe('Visual Smoke Tests', () => {
  test('dashboard should render charts correctly', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to load and charts to render
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(300) // Wait for charts to stabilize
    
    // Take screenshot of dashboard
    await expect(page).toHaveScreenshot('dashboard.png', {
      fullPage: false,
      clip: { x: 0, y: 0, width: 1200, height: 800 }
    })
  })

  test('expenses page should render form correctly', async ({ page }) => {
    await page.goto('/expenses')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Take screenshot of expenses form
    await expect(page).toHaveScreenshot('expenses-form.png', {
      fullPage: false,
      clip: { x: 0, y: 0, width: 1200, height: 600 }
    })
  })

  test('transaction table should render correctly', async ({ page }) => {
    await page.goto('/expenses')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Scroll to transaction table
    await page.getByTestId('tx-table').scrollIntoViewIfNeeded()
    
    // Take screenshot of transaction table
    await expect(page.getByTestId('tx-table')).toHaveScreenshot('transaction-table.png')
  })

  test('charts should have proper dimensions', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(300)
    
    // Check if chart containers have proper dimensions
    const dailyChart = page.getByTestId('chart-daily')
    const donutChart = page.getByTestId('chart-donut')
    
    await expect(dailyChart).toBeVisible()
    await expect(donutChart).toBeVisible()
    
    // Check chart dimensions (should be reasonable sizes)
    const dailyBox = await dailyChart.boundingBox()
    const donutBox = await donutChart.boundingBox()
    
    expect(dailyBox?.width).toBeGreaterThan(200)
    expect(dailyBox?.height).toBeGreaterThan(200)
    expect(donutBox?.width).toBeGreaterThan(200)
    expect(donutBox?.height).toBeGreaterThan(200)
  })
})
