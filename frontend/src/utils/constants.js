/**
 * Application-wide constants — routes, enums, UI defaults.
 * Single source of truth for API paths (relative to API base URL).
 */

/** localStorage keys */
export const STORAGE_KEYS = {
  TOKEN: 'finance_buddy_token',
  USER: 'finance_buddy_user',
}

/** API path segments (appended to VITE_API_BASE_URL) */
export const API_ROUTES = {
  HEALTH: '/health',
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  CATEGORIES: {
    ROOT: '/categories',
  },
  TRANSACTIONS: {
    ROOT: '/transactions',
    BY_ID: (id) => `/transactions/${id}`,
    RECURRING_UPCOMING: '/transactions/recurring/upcoming',
  },
  BUDGETS: {
    ROOT: '/budgets',
    STATUS: '/budgets/status',
    BY_ID: (id) => `/budgets/${id}`,
  },
  GOALS: {
    ROOT: '/goals',
    BY_ID: (id) => `/goals/${id}`,
    CONTRIBUTE: (id) => `/goals/${id}/contribute`,
  },
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    MONTHLY: '/analytics/monthly',
    BY_CATEGORY: '/analytics/by-category',
    INCOME_VS_EXPENSE: '/analytics/income-vs-expense',
    SAVINGS_TRENDS: '/analytics/savings-trends',
    RECENT: '/analytics/recent',
    TOP_CATEGORIES: '/analytics/top-categories',
  },
  NOTIFICATIONS: {
    ROOT: '/notifications',
    READ_ALL: '/notifications/read-all',
    READ: (id) => `/notifications/${id}/read`,
    UPCOMING_BILLS: '/notifications/upcoming-bills',
    SYNC_BILL_REMINDERS: '/notifications/sync-bill-reminders',
  },
  REPORTS: {
    SUMMARY: '/reports/summary',
    EXPORT: '/reports/export',
  },
  IMPORT: {
    CSV: '/import/csv',
  },
  AI: {
    ROOT: '/ai',
    LATEST: '/ai/latest',
    FINANCIAL_HEALTH: '/ai/financial-health',
  },
}

/** Supported account currencies (matches backend User schema) */
export const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD']

export const DEFAULT_CURRENCY = 'INR'

/** Transaction */
export const TRANSACTION_TYPES = ['income', 'expense']

export const SPENDING_TYPES = ['recurring_bill', 'one_time', 'discretionary']

export const RECURRENCE_RULES = ['weekly', 'monthly', 'yearly']

export const TRANSACTION_SOURCES = ['manual', 'csv', 'mock_bank', 'ocr']

/** Budget */
export const BUDGET_PERIODS = ['weekly', 'monthly']

export const DEFAULT_BUDGET_PERIOD = 'monthly'

export const DEFAULT_ALERT_THRESHOLD_PCT = 80

export const BUDGET_THRESHOLD_MIN = 50

export const BUDGET_THRESHOLD_MAX = 100

/** Budget status bands for UI (percent of limit used) */
export const BUDGET_STATUS = {
  SAFE: 'safe',
  WARNING: 'warning',
  EXCEEDED: 'exceeded',
}

/** Goals */
export const GOAL_STATUSES = ['active', 'completed', 'paused']

/** Notifications */
export const NOTIFICATION_TYPES = [
  'budget_warning',
  'budget_exceeded',
  'bill_due',
  'goal_milestone',
  'goal_completed',
  'system',
  'ai_insight',
]

export const NOTIFICATION_PRIORITIES = ['low', 'medium', 'high']

/** AI insights (LangChain / cached insights) */
export const AI_INSIGHT_TYPES = [
  'financial_health',
  'spending_pattern',
  'savings_tip',
]

export const DEFAULT_AI_INSIGHT_TYPE = 'financial_health'

/** Default category presets for forms (seed may add user categories) */
export const DEFAULT_EXPENSE_CATEGORY_HINTS = [
  'Food & Dining',
  'Transport',
  'Housing',
  'Utilities',
  'Shopping',
  'Healthcare',
  'Entertainment',
]

export const DEFAULT_INCOME_CATEGORY_HINTS = ['Salary', 'Freelance', 'Investments', 'Other Income']

/** UI / app */
export const APP_NAME = 'Finance Buddy'

export const DEFAULT_PAGE_SIZE = 50

export const MAX_TRANSACTION_LIMIT = 200

export const DEFAULT_RECENT_TRANSACTIONS_LIMIT = 10

export const DEFAULT_TOP_CATEGORIES_LIMIT = 5

export const DEFAULT_UPCOMING_BILLS_DAYS = 14

export const DEFAULT_NOTIFICATION_LIMIT = 50

/** HTTP */
export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  SERVER_ERROR: 500,
}
