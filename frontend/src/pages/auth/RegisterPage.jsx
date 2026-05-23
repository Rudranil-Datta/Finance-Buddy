import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth.js'
import { DEFAULT_AUTHENTICATED_ROUTE, ROUTES } from '@/app/router/paths.js'
import { validateRegisterForm } from '@/utils/authValidation.js'
import AuthCard from '@/components/auth/AuthCard.jsx'
import Button from '@/components/ui/Button.jsx'
import Input from '@/components/ui/Input.jsx'
import FormField from '@/components/ui/FormField.jsx'
import ErrorMessage from '@/components/feedback/ErrorMessage.jsx'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading, error, clearError } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  function clearFieldError(key) {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    clearError()

    const { errors, isValid } = validateRegisterForm({
      name,
      email,
      password,
      confirmPassword,
    })
    setFieldErrors(errors)
    if (!isValid) return

    try {
      const data = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      })
      navigate(DEFAULT_AUTHENTICATED_ROUTE, {
        replace: true,
        state: {
          authSuccess: true,
          message: `Account created${data?.user?.name ? ` — welcome, ${data.user.name}` : ''}!`,
        },
      })
    } catch {
      /* surfaced via AuthContext */
    }
  }

  return (
    <AuthCard
      title="Create account"
      subtitle="Start tracking spending, budgets, and goals in minutes."
      footer={
        <>
          Already have an account?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="font-medium text-accent hover:text-accent-hover"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <ErrorMessage message={error} />}

        <FormField label="Full name" htmlFor="name" required error={fieldErrors.name}>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            value={name}
            error={Boolean(fieldErrors.name)}
            disabled={isLoading}
            onChange={(e) => {
              setName(e.target.value)
              clearFieldError('name')
            }}
          />
        </FormField>

        <FormField label="Email" htmlFor="email" required error={fieldErrors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            error={Boolean(fieldErrors.email)}
            disabled={isLoading}
            onChange={(e) => {
              setEmail(e.target.value)
              clearFieldError('email')
            }}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          required
          hint="At least 8 characters"
          error={fieldErrors.password}
        >
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            error={Boolean(fieldErrors.password)}
            disabled={isLoading}
            onChange={(e) => {
              setPassword(e.target.value)
              clearFieldError('password')
            }}
          />
        </FormField>

        <FormField
          label="Confirm password"
          htmlFor="confirmPassword"
          required
          error={fieldErrors.confirmPassword}
        >
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            error={Boolean(fieldErrors.confirmPassword)}
            disabled={isLoading}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              clearFieldError('confirmPassword')
            }}
          />
        </FormField>

        <Button type="submit" className="w-full" size="lg" loading={isLoading}>
          Create account
        </Button>
      </form>
    </AuthCard>
  )
}
