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
