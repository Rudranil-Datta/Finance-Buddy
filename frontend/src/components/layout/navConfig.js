import {
  LayoutDashboard,
  ArrowLeftRight,
  FileUp,
  Wallet,
  Target,
  Bell,
  Sparkles,
} from 'lucide-react'
import { ROUTES } from '@/app/router/paths.js'

/**
 * Primary sidebar navigation (main app sections).
 */
export const MAIN_NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.TRANSACTIONS, label: 'Transactions', icon: ArrowLeftRight },
  { to: ROUTES.IMPORT, label: 'Import', icon: FileUp },
  { to: ROUTES.BUDGETS, label: 'Budgets', icon: Wallet },
  { to: ROUTES.GOALS, label: 'Goals', icon: Target },
  { to: ROUTES.NOTIFICATIONS, label: 'Notifications', icon: Bell },
  { to: ROUTES.AI, label: 'AI Insights', icon: Sparkles },
]
