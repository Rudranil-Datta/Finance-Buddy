import { RouterProvider } from 'react-router-dom'
import { router } from './createRouter.js'

/**
 * Application router — mount inside AppProviders (AuthProvider).
 */
export default function AppRouter() {
  return <RouterProvider router={router} />
}
