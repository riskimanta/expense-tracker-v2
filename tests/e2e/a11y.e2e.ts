import { test, expect } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test('dashboard should meet accessibility standards', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle')
    
    // Run accessibility audit
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    
    // Check for violations
    expect(accessibilityScanResults.violations).toEqual([])
    
    // Log any issues found
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Accessibility violations found:', accessibilityScanResults.violations)
    }
  })

  test('expenses page should meet accessibility standards', async ({ page }) => {
    await page.goto('/expenses')
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle')
    
    // Run accessibility audit
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    
    // Check for violations
    expect(accessibilityScanResults.violations).toEqual([])
    
    // Log any issues found
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Accessibility violations found:', accessibilityScanResults.violations)
    }
  })

  test('form elements should have proper labels', async ({ page }) => {
    await page.goto('/expenses')
    
    // Check if form elements have proper labels
    await expect(page.getByLabel('Tanggal')).toBeVisible()
    await expect(page.getByLabel('Kategori')).toBeVisible()
    await expect(page.getByLabel('Jumlah')).toBeVisible()
    await expect(page.getByLabel('Akun')).toBeVisible()
    await expect(page.getByLabel('Catatan')).toBeVisible()
  })

  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/expenses')
    
    // Check heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 })
    const h2 = page.getByRole('heading', { level: 2 })
    
    await expect(h1).toHaveCount(1)
    await expect(h1.first()).toHaveText('Pengeluaran')
    
    // Should have at least one h2 heading
    await expect(h2).toHaveCount.greaterThan(0)
  })
})
