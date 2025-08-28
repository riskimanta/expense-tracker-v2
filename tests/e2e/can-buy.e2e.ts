import { test, expect } from '@playwright/test'

test.describe('Can Buy Tests', () => {
  test('should check if user can afford item', async ({ page }) => {
    await page.goto('/')
    
    // Wait for MiniAdvisor to load
    await expect(page.getByTestId('canbuy-input')).toBeVisible()
    await expect(page.getByTestId('canbuy-submit')).toBeVisible()
    
    // Input amount
    await page.getByTestId('canbuy-input').clear()
    await page.getByTestId('canbuy-input').type('50000')
    
    // Click check button
    await page.getByTestId('canbuy-submit').click()
    
    // Wait for result
    await expect(page.getByTestId('canbuy-result')).toBeVisible()
    
    // Check if result shows correct format
    await expect(page.getByText(/Rp\s?50\.000/)).toBeVisible()
    
    // Check if verdict is displayed (either "bisa" or "tidak")
    const resultText = await page.getByTestId('canbuy-result').textContent()
    expect(resultText).toMatch(/(Aman!|Tunda dulu)/)
  })

  test('should handle different amounts', async ({ page }) => {
    await page.goto('/')
    
    // Wait for MiniAdvisor to load
    await expect(page.getByTestId('canbuy-input')).toBeVisible()
    
    // Test with large amount
    await page.getByTestId('canbuy-input').clear()
    await page.getByTestId('canbuy-input').type('10000000')
    
    await page.getByTestId('canbuy-submit').click()
    
    await expect(page.getByTestId('canbuy-result')).toBeVisible()
    await expect(page.getByText(/Rp\s?10\.000\.000/)).toBeVisible()
  })

  test('should show recommendation based on affordability', async ({ page }) => {
    await page.goto('/')
    
    // Wait for MiniAdvisor to load
    await expect(page.getByTestId('canbuy-input')).toBeVisible()
    
    // Input affordable amount
    await page.getByTestId('canbuy-input').clear()
    await page.getByTestId('canbuy-input').type('100000')
    
    await page.getByTestId('canbuy-submit').click()
    
    await expect(page.getByTestId('canbuy-result')).toBeVisible()
    
    // Check if recommendation is shown
    const resultText = await page.getByTestId('canbuy-result').textContent()
    expect(resultText).toMatch(/(Beli sekarang|Tunggu gaji|kurangi pengeluaran)/)
  })
})
