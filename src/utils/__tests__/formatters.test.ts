import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate } from '../formatters'

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00')
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('should format negative numbers correctly', () => {
      expect(formatCurrency(-500)).toBe('-$500.00')
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56')
    })

    it('should handle decimal values correctly', () => {
      expect(formatCurrency(10.5)).toBe('$10.50')
      expect(formatCurrency(99.99)).toBe('$99.99')
      expect(formatCurrency(100.1)).toBe('$100.10')
    })

    it('should handle large numbers correctly', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00')
      expect(formatCurrency(999999.99)).toBe('$999,999.99')
    })
  })

  describe('formatDate', () => {
    it('should format valid date strings correctly', () => {
      expect(formatDate('2024-01-15')).toBe('Jan 15, 2024')
      expect(formatDate('2024-12-31')).toBe('Dec 31, 2024')
    })

    it('should handle different date formats', () => {
      // ISO format
      expect(formatDate('2024-10-07')).toBe('Oct 7, 2024')
    })

    it('should handle Date objects', () => {
      const date = new Date('2024-10-07')
      expect(formatDate(date.toISOString())).toBe('Oct 7, 2024')
    })
  })
})
