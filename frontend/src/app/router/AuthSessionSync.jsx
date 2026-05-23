import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setUnauthorizedHandler } from '@/api'
import { useAuth } from '@/hooks/useAuth.js'
import { DEFAULT_GUEST_ROUTE } from './paths.js'

/**
 * Registers global 401 handler inside the router (requires useNavigate).
 * Renders nothing — mount once at the root of the route tree.
 */
export default function AuthSessionSync() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout()
      navigate(DEFAULT_GUEST_ROUTE, {
        replace: true,
        state: { sessionExpired: true },
      })
    })

    return () => setUnauthorizedHandler(null)
  }, [navigate, logout])

  return null
}
