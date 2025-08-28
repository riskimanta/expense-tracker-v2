import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CurrencyInput } from '../../components/ui/currency-input'

describe('CurrencyInput', () => {
  it('should format input correctly', () => {
    const mockOnChange = vi.fn()
    render(
      <CurrencyInput
        value={50000}
        onValueChange={mockOnChange}
        placeholder="Enter amount"
      />
    )

    const input = screen.getByPlaceholderText('Enter amount')
    expect(input).toHaveValue('50.000')
  })

  it('should format with prefix when provided', () => {
    const mockOnChange = vi.fn()
    render(
      <CurrencyInput
        value={50000}
        onValueChange={mockOnChange}
        prefix="Rp "
        placeholder="Enter amount"
      />
    )

    const input = screen.getByPlaceholderText('Enter amount')
    expect(input).toHaveValue('Rp 50.000')
  })

  it('should call onValueChange with correct value', () => {
    const mockOnChange = vi.fn()
    render(
      <CurrencyInput
        value={null}
        onValueChange={mockOnChange}
        placeholder="Enter amount"
      />
    )

    const input = screen.getByPlaceholderText('Enter amount')
    fireEvent.change(input, { target: { value: '100000' } })

    expect(mockOnChange).toHaveBeenCalledWith(100000)
  })

  it('should handle empty input', () => {
    const mockOnChange = vi.fn()
    render(
      <CurrencyInput
        value={null}
        onValueChange={mockOnChange}
        placeholder="Enter amount"
      />
    )

    const input = screen.getByPlaceholderText('Enter amount')
    fireEvent.change(input, { target: { value: '' } })

    expect(mockOnChange).toHaveBeenCalledWith(null)
  })

  it('should format large numbers correctly', () => {
    const mockOnChange = vi.fn()
    render(
      <CurrencyInput
        value={1000000}
        onValueChange={mockOnChange}
        placeholder="Enter amount"
      />
    )

    const input = screen.getByPlaceholderText('Enter amount')
    expect(input).toHaveValue('1.000.000')
  })
})
