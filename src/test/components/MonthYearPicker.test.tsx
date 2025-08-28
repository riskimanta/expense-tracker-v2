import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MonthYearPicker } from '../../components/ui/month-year-picker'

describe('MonthYearPicker', () => {
  it('should display current month and year when no value provided', () => {
    const mockOnChange = vi.fn()
    const currentDate = new Date()
    const currentMonth = currentDate.toLocaleDateString('id-ID', { month: 'long' })
    const currentYear = currentDate.getFullYear()
    
    render(
      <MonthYearPicker
        value={null}
        onChange={mockOnChange}
        placeholder="Pilih bulan"
      />
    )

    expect(screen.getByText(`${currentMonth} ${currentYear}`)).toBeVisible()
  })

  it('should call onChange when month is selected', () => {
    const mockOnChange = vi.fn()
    const testDate = new Date(2025, 0, 1) // January 2025
    
    render(
      <MonthYearPicker
        value={testDate}
        onChange={mockOnChange}
        placeholder="Pilih bulan"
      />
    )

    // Click to open picker
    const trigger = screen.getByRole('button', { name: 'Pilih bulan' })
    fireEvent.click(trigger)

    // Click on November (index 10)
    const novemberButton = screen.getByText('Nov')
    fireEvent.click(novemberButton)

    // Check if onChange was called with November 2025
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Date))
    const calledDate = mockOnChange.mock.calls[0][0]
    expect(calledDate.getMonth()).toBe(10) // November is month 10 (0-indexed)
    expect(calledDate.getFullYear()).toBe(2025)
  })

  it('should navigate between years', () => {
    const mockOnChange = vi.fn()
    const testDate = new Date(2025, 0, 1)
    
    render(
      <MonthYearPicker
        value={testDate}
        onChange={mockOnChange}
        placeholder="Pilih bulan"
      />
    )

    // Click to open picker
    const trigger = screen.getByRole('button', { name: 'Pilih bulan' })
    fireEvent.click(trigger)

    // Check initial year
    expect(screen.getByText('2025')).toBeVisible()

    // Click next year
    const nextYearButton = screen.getByLabelText('Tahun berikutnya')
    fireEvent.click(nextYearButton)
    expect(screen.getByText('2026')).toBeVisible()

    // Click previous year
    const prevYearButton = screen.getByLabelText('Tahun sebelumnya')
    fireEvent.click(prevYearButton)
    expect(screen.getByText('2025')).toBeVisible()
  })

  it('should show placeholder when no value is selected', () => {
    const mockOnChange = vi.fn()
    
    render(
      <MonthYearPicker
        value={null}
        onChange={mockOnChange}
        placeholder="Pilih bulan"
      />
    )

    expect(screen.getByText('Pilih bulan')).toBeVisible()
  })

  it('should display all 12 months', () => {
    const mockOnChange = vi.fn()
    const testDate = new Date(2025, 0, 1)
    
    render(
      <MonthYearPicker
        value={testDate}
        onChange={mockOnChange}
        placeholder="Pilih bulan"
      />
    )

    // Click to open picker
    const trigger = screen.getByRole('button', { name: 'Pilih bulan' })
    fireEvent.click(trigger)

    // Check if all months are displayed
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    months.forEach(month => {
      expect(screen.getByText(month)).toBeVisible()
    })
  })
})
