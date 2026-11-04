import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO, isValid } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | Date | null | undefined, formatPattern = 'dd MMM yyyy'): string {
  if (!dateString) return '-'
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString
    if (!isValid(date)) return dateString.toString()
    return format(date, formatPattern)
  } catch {
    return String(dateString)
  }
}

export function formatKilometers(km: number | string | null | undefined): string {
  if (km === null || km === undefined || km === '') return '0 km'
  const num = typeof km === 'number' ? km : parseFloat(km)
  if (isNaN(num)) return '0 km'
  return `${num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} km`
}

export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') return '₹0.00'
  const num = typeof amount === 'number' ? amount : parseFloat(amount)
  if (isNaN(num)) return '₹0.00'
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatNumber(num: number | string | null | undefined): string {
  if (num === null || num === undefined) return '0'
  const n = typeof num === 'number' ? num : parseFloat(num)
  if (isNaN(n)) return '0'
  return n.toLocaleString()
}

