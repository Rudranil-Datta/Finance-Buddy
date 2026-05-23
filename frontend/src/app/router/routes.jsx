import { Navigate } from 'react-router-dom'
import RootLayout from './RootLayout.jsx'
import RouteErrorFallback from './RouteErrorFallback.jsx'
import PrivateRoute from './guards/PrivateRoute.jsx'
import GuestRoute from './guards/GuestRoute.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'
import MinimalLayout from '../layouts/MinimalLayout.jsx'
import { ROUTES, DEFAULT_AUTHENTICATED_ROUTE } from './paths.js'

import LoginPage from '@/pages/auth/LoginPage.jsx'
import RegisterPage from '@/pages/auth/RegisterPage.jsx'
import NotFoundPage from '@/pages/NotFoundPage.jsx'
import DashboardPage from '@/features/dashboard/pages/DashboardPage.jsx'
import TransactionsPage from '@/features/transactions/pages/TransactionsPage.jsx'
import BudgetsPage from '@/features/budgets/pages/BudgetsPage.jsx'
import GoalsPage from '@/features/goals/pages/GoalsPage.jsx'
import NotificationsPage from '@/features/notifications/pages/NotificationsPage.jsx'
import AnalyticsPage from '@/features/analytics/pages/AnalyticsPage.jsx'
import ReportsPage from '@/features/reports/pages/ReportsPage.jsx'
import ImportPage from '@/features/import/pages/ImportPage.jsx'
import AIPage from '@/features/ai/pages/AIPage.jsx'

/**
 * Application route tree.
 */
export const routes = [
  {
    element: <RootLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        index: true,
        element: <Navigate to={DEFAULT_AUTHENTICATED_ROUTE} replace />,
      },

      {
        element: <GuestRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: ROUTES.LOGIN, element: <LoginPage /> },
              { path: ROUTES.REGISTER, element: <RegisterPage /> },
            ],
          },
        ],
      },

      {
        element: <PrivateRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
              { path: ROUTES.TRANSACTIONS, element: <TransactionsPage /> },
              { path: ROUTES.BUDGETS, element: <BudgetsPage /> },
              { path: ROUTES.GOALS, element: <GoalsPage /> },
              { path: ROUTES.NOTIFICATIONS, element: <NotificationsPage /> },
              { path: ROUTES.ANALYTICS, element: <AnalyticsPage /> },
              { path: ROUTES.REPORTS, element: <ReportsPage /> },
              { path: ROUTES.IMPORT, element: <ImportPage /> },
              { path: ROUTES.AI, element: <AIPage /> },
              { path: '*', element: <NotFoundPage variant="app" /> },
            ],
          },
        ],
      },

      {
        element: <MinimalLayout />,
        children: [{ path: '*', element: <NotFoundPage /> }],
      },
    ],
  },
]
