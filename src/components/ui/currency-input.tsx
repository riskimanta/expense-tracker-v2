import React, { useState, useEffect } from 'react'
import { Input } from './input'
import { formatNumberToIndonesian, parseIndonesianNumber } from '@/lib/format'

interface CurrencyInputProps {
  value: number
  onChange: (value: number) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function CurrencyInput({ 
  value, 
  onChange, 
  placeholder = "0", 
  className = "",
  disabled = false 
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("")

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setDisplayValue(formatNumberToIndonesian(value))
    } else {
      setDisplayValue("")
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    
    // Allow empty input
    if (inputValue === "") {
      setDisplayValue("")
      onChange(0)
      return
    }

    // Parse the input value
    const numericValue = parseIndonesianNumber(inputValue)
    
    // Update display with formatted value
    setDisplayValue(formatNumberToIndonesian(numericValue))
    
    // Call onChange with numeric value
    onChange(numericValue)
  }

  const handleBlur = () => {
    // Ensure display is properly formatted on blur
    if (value !== undefined && value !== null) {
      setDisplayValue(formatNumberToIndonesian(value))
    }
  }

  return (
    <Input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
    />
  )
}
