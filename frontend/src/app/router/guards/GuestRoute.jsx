import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth.js'
import { DEFAULT_AUTHENTICATED_ROUTE } from '../paths.js'
import AuthLoadingScreen from './AuthLoadingScreen.jsx'

/**
 * Guest-only routes (login/register).
 * Redirects authenticated users to the dashboard.
 */
export default function GuestRoute() {
  const { isAuthenticated, isReady } = useAuth()

  if (!isReady) {
    return <AuthLoadingScreen message="Loading…" />
  }

  if (isAuthenticated) {
    return <Navigate to={DEFAULT_AUTHENTICATED_ROUTE} replace />
  }

  return <Outlet />
}
