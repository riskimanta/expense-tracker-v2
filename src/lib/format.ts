import dayjs from 'dayjs'
import 'dayjs/locale/id'

// Set Indonesian as default locale
dayjs.locale('id')

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDateID(date: string): string {
  const dateObj = new Date(date)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj)
}

export function formatDateShort(date: string): string {
  const dateObj = new Date(date)
  return new Intl.DateTimeFormat('id-ID', {
    month: 'short',
    day: 'numeric',
  }).format(dateObj)
}

export function formatMonthYear(date: string): string {
  const dateObj = new Date(date)
  return new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(dateObj)
}

/**
 * Format number to Indonesian format with thousand separators
 * Example: 7000000 -> 7.000.000
 */
export function formatNumberToIndonesian(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0';
  
  return num.toLocaleString('id-ID');
}

/**
 * Parse Indonesian formatted number back to number
 * Example: "7.000.000" -> 7000000
 */
export function parseIndonesianNumber(value: string): number {
  if (!value) return 0;
  
  // Remove all dots and replace comma with dot for decimal
  const cleanValue = value.replace(/\./g, '').replace(',', '.');
  const num = parseFloat(cleanValue);
  
  return isNaN(num) ? 0 : num;
}
