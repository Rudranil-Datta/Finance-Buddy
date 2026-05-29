import { CURRENCIES } from '@/utils/constants.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(String(value).trim())
}

/**
 * @returns {{ errors: Record<string, string>, isValid: boolean }}
 */
export function validateLoginForm({ email, password }) {
  const errors = {}
  const trimmedEmail = email.trim()

  if (!trimmedEmail) errors.email = 'Email is required'
  else if (!isValidEmail(trimmedEmail)) errors.email = 'Enter a valid email address'

  if (!password) errors.password = 'Password is required'

  return { errors, isValid: Object.keys(errors).length === 0 }
}

/**
 * @returns {{ errors: Record<string, string>, isValid: boolean }}
 */
export function validateRegisterForm({
  name,
  email,
  password,
  confirmPassword,
  currency,
}) {
  const errors = {}
  const trimmedName = name.trim()
  const trimmedEmail = email.trim()

  if (!trimmedName) errors.name = 'Name is required'
  else if (trimmedName.length > 100) errors.name = 'Name must be 100 characters or less'

  if (!trimmedEmail) errors.email = 'Email is required'
  else if (!isValidEmail(trimmedEmail)) errors.email = 'Enter a valid email address'

  if (!currency) errors.currency = 'Currency is required'
  else if (!CURRENCIES.includes(currency)) {
    errors.currency = 'Select a valid currency'
  }

  if (!password) errors.password = 'Password is required'
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters'
  else if (password.length > 128) errors.password = 'Password must be 128 characters or less'

  if (!confirmPassword) errors.confirmPassword = 'Please confirm your password'
  else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return { errors, isValid: Object.keys(errors).length === 0 }
}
