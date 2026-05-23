import AppProviders from '@/app/providers/AppProviders.jsx'
import AppRouter from '@/app/router/index.jsx'

/**
 * Root application — providers wrap the router.
 * Auth bootstraps inside AuthProvider before route guards render.
 */
export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}
