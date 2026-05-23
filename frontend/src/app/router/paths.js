/**
 * Centralized route path constants.
 * Use these instead of string literals across the app.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/transactions',
  BUDGETS: '/budgets',
  GOALS: '/goals',
  NOTIFICATIONS: '/notifications',
  ANALYTICS: '/analytics',
  REPORTS: '/reports',
  IMPORT: '/import',
  AI: '/ai',
}

/** Routes that require authentication */
export const PROTECTED_ROUTE_PATHS = [
  ROUTES.DASHBOARD,
  ROUTES.TRANSACTIONS,
  ROUTES.BUDGETS,
  ROUTES.GOALS,
  ROUTES.NOTIFICATIONS,
  ROUTES.ANALYTICS,
  ROUTES.REPORTS,
  ROUTES.IMPORT,
  ROUTES.AI,
]

/** Routes only for unauthenticated users */
export const GUEST_ROUTE_PATHS = [ROUTES.LOGIN, ROUTES.REGISTER]

/** Default landing after login */
export const DEFAULT_AUTHENTICATED_ROUTE = ROUTES.DASHBOARD

/** Default redirect when session expires or access denied */
export const DEFAULT_GUEST_ROUTE = ROUTES.LOGIN
