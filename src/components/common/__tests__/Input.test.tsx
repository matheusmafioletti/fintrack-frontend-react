import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../Input'

describe('Input Component', () => {
  it('should render input with label', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('should handle value changes', () => {
    const handleChange = vi.fn()
    render(<Input label="Test" onChange={handleChange} />)
    
    const input = screen.getByLabelText('Test')
    fireEvent.change(input, { target: { value: 'test value' } })
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('should display error message when error prop is provided', () => {
    render(<Input label="Email" error="Email is required" />)
    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })

  it('should display helper text when provided', () => {
    render(<Input label="Password" helperText="Minimum 8 characters" />)
    expect(screen.getByText('Minimum 8 characters')).toBeInTheDocument()
  })

  it('should show required indicator when required prop is true', () => {
    render(<Input label="Name" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should handle different input types', () => {
    const { rerender } = render(<Input label="Email" type="email" />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
    
    rerender(<Input label="Password" type="password" />)
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
    
    rerender(<Input label="Number" type="number" />)
    expect(screen.getByLabelText('Number')).toHaveAttribute('type', 'number')
  })

  it('should show placeholder when provided', () => {
    render(<Input label="Email" placeholder="Enter your email" />)
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input label="Disabled" disabled />)
    expect(screen.getByLabelText('Disabled')).toBeDisabled()
  })

  it('should apply custom className', () => {
    render(<Input label="Custom" className="custom-class" />)
    expect(screen.getByLabelText('Custom')).toHaveClass('custom-class')
  })
})
