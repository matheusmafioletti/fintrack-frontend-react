export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 8
}

export const validateAmount = (amount: number): boolean => {
  return amount > 0
}

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0
}

export const validateMinLength = (value: string, min: number): boolean => {
  return value.length >= min
}

export const validateMaxLength = (value: string, max: number): boolean => {
  return value.length <= max
}
