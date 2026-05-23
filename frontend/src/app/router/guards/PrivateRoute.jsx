import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth.js'
import { DEFAULT_GUEST_ROUTE } from '../paths.js'
import AuthLoadingScreen from './AuthLoadingScreen.jsx'

/**
 * Protects child routes — requires valid JWT session.
 * Redirects to login with return path in location state.
 */
export default function PrivateRoute() {
  const { isAuthenticated, isReady } = useAuth()
  const location = useLocation()

  if (!isReady) {
    return <AuthLoadingScreen message="Checking your session…" />
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={DEFAULT_GUEST_ROUTE}
        replace
        state={{ from: location.pathname + location.search }}
      />
    )
  }

  return <Outlet />
}
