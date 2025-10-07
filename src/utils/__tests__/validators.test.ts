import { describe, it, expect } from 'vitest'
import { validateEmail, validatePassword, validateMinLength } from '../validators'

describe('validators', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('user+tag@example.com')).toBe(true)
    })

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('invalid@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should return true for passwords with 8 or more characters', () => {
      expect(validatePassword('password123')).toBe(true)
      expect(validatePassword('12345678')).toBe(true)
      expect(validatePassword('a'.repeat(8))).toBe(true)
    })

    it('should return false for passwords with less than 8 characters', () => {
      expect(validatePassword('1234567')).toBe(false)
      expect(validatePassword('pass')).toBe(false)
      expect(validatePassword('')).toBe(false)
    })
  })

  describe('validateMinLength', () => {
    it('should return true when string meets minimum length', () => {
      expect(validateMinLength('hello', 3)).toBe(true)
      expect(validateMinLength('test', 4)).toBe(true)
      expect(validateMinLength('a'.repeat(10), 5)).toBe(true)
    })

    it('should return false when string is shorter than minimum length', () => {
      expect(validateMinLength('hi', 3)).toBe(false)
      expect(validateMinLength('test', 5)).toBe(false)
      expect(validateMinLength('', 1)).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(validateMinLength('exact', 5)).toBe(true)
      expect(validateMinLength('exact', 6)).toBe(false)
    })
  })
})
