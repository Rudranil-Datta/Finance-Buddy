import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth.js'
import { DEFAULT_AUTHENTICATED_ROUTE, ROUTES } from '@/app/router/paths.js'
import { validateLoginForm } from '@/utils/authValidation.js'
import AuthCard from '@/components/auth/AuthCard.jsx'
import Button from '@/components/ui/Button.jsx'
import Input from '@/components/ui/Input.jsx'
import FormField from '@/components/ui/FormField.jsx'
import ErrorMessage from '@/components/feedback/ErrorMessage.jsx'
import AlertBanner from '@/components/feedback/AlertBanner.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading, error, clearError } = useAuth()

  const sessionExpired = location.state?.sessionExpired
  const returnTo = location.state?.from

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

    const { errors, isValid } = validateLoginForm({ email, password })
    setFieldErrors(errors)
    if (!isValid) return

    try {
      const data = await login({
        email: email.trim().toLowerCase(),
        password,
      })
      navigate(returnTo || DEFAULT_AUTHENTICATED_ROUTE, {
        replace: true,
        state: {
          authSuccess: true,
          message: `Welcome back${data?.user?.name ? `, ${data.user.name}` : ''}!`,
        },
      })
    } catch {
      /* surfaced via AuthContext */
    }
  }

  return (
    <AuthCard
      title="Sign in"
      subtitle="Access your finances, budgets, and insights in one place."
      footer={
        <>
          No account?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="font-medium text-accent hover:text-accent-hover"
          >
            Create one
          </Link>
        </>
      }
    >
      {sessionExpired && (
        <AlertBanner
          variant="warning"
          className="mb-4"
          title="Session expired"
          message="Please sign in again to continue."
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && <ErrorMessage message={error} />}

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
          error={fieldErrors.password}
        >
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
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

        <Button type="submit" className="w-full" size="lg" loading={isLoading}>
          Sign in
        </Button>
      </form>

      <p className="mt-4 rounded-lg border border-dashed border-border bg-background px-3 py-2 text-xs text-muted">
        <span className="font-medium text-foreground">For Demo:</span>{' '}
        <code className="text-accent">demo@financebuddy.local</code> /{' '}
        <code className="text-accent">Demo1234!</code>
      </p>
    </AuthCard>
  )
}
