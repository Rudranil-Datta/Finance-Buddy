/**
 * Realistic fallback when the API is unreachable.
 * Shape mirrors backend analytics / budget / AI responses.
 */

export const mockDashboardSummary = {
  totalIncome: 8420,
  totalExpense: 5280.45,
  netSavings: 3139.55,
  transactionCount: 47,
}

export const mockMonthlyTrend = [
  { period: '2025-10', expense: 4120, income: 7800, netSavings: 3680 },
  { period: '2025-11', expense: 4890, income: 8100, netSavings: 3210 },
  { period: '2025-12', expense: 5520, income: 8200, netSavings: 2680 },
  { period: '2026-01', expense: 4980, income: 8350, netSavings: 3370 },
  { period: '2026-02', expense: 4650, income: 8400, netSavings: 3750 },
  { period: '2026-03', expense: 5280.45, income: 8420, netSavings: 3139.55 },
]

export const mockCategorySpending = [
  { categoryName: 'Food & Dining', color: '#4f46e5', total: 1420.5, percentage: 26.9 },
  { categoryName: 'Housing', color: '#0ea5e9', total: 1280, percentage: 24.2 },
  { categoryName: 'Transport', color: '#10b981', total: 640, percentage: 12.1 },
  { categoryName: 'Shopping', color: '#f59e0b', total: 520.95, percentage: 9.9 },
  { categoryName: 'Utilities', color: '#f43f5e', total: 419, percentage: 7.9 },
]

export const mockRecentTransactions = [
  {
    id: '1',
    description: 'Whole Foods Market',
    amount: 86.42,
    type: 'expense',
    date: new Date(Date.now() - 86400000).toISOString(),
    categoryName: 'Food & Dining',
    categoryColor: '#4f46e5',
  },
  {
    id: '2',
    description: 'Salary deposit',
    amount: 4200,
    type: 'income',
    date: new Date(Date.now() - 172800000).toISOString(),
    categoryName: 'Salary',
    categoryColor: '#10b981',
  },
  {
    id: '3',
    description: 'Uber ride',
    amount: 24.5,
    type: 'expense',
    date: new Date(Date.now() - 259200000).toISOString(),
    categoryName: 'Transport',
    categoryColor: '#10b981',
  },
  {
    id: '4',
    description: 'Netflix',
    amount: 15.99,
    type: 'expense',
    date: new Date(Date.now() - 345600000).toISOString(),
    categoryName: 'Entertainment',
    categoryColor: '#f59e0b',
  },
  {
    id: '5',
    description: 'Electric bill',
    amount: 142.3,
    type: 'expense',
    date: new Date(Date.now() - 432000000).toISOString(),
    categoryName: 'Utilities',
    categoryColor: '#f43f5e',
  },
]

export const mockBudgetStatuses = [
  {
    id: 'b1',
    categoryName: 'Food & Dining',
    color: '#4f46e5',
    spent: 1420.5,
    limitAmount: 1800,
    pctUsed: 78.9,
    isOver: false,
    isWarning: false,
  },
  {
    id: 'b2',
    categoryName: 'Transport',
    color: '#10b981',
    spent: 640,
    limitAmount: 600,
    pctUsed: 106.7,
    isOver: true,
    isWarning: false,
  },
  {
    id: 'b3',
    categoryName: 'Shopping',
    color: '#f59e0b',
    spent: 320,
    limitAmount: 500,
    pctUsed: 64,
    isOver: false,
    isWarning: false,
  },
]

export const mockPlaceholderInsights = [
  {
    id: 'insight-spending',
    type: 'spending_pattern',
    title: 'Spending recommendation',
    summary:
      'Example: Dining spend is up 12% vs last month. Shifting two meals per week to groceries could save ~$180.',
    tag: 'Recommendation',
    isPlaceholder: true,
  },
  {
    id: 'insight-anomaly',
    type: 'anomaly',
    title: 'Anomaly detection',
    summary:
      'Example: Unusual $420 charge in Shopping on Mar 12 — 3.2× your typical weekly average for that category.',
    tag: 'Alert',
    isPlaceholder: true,
  },
  {
    id: 'insight-savings',
    type: 'savings_tip',
    title: 'Savings insight',
    summary:
      'Example: Your savings rate is 37% this month. Increasing automated transfers by $150 would hit your goal 2 weeks sooner.',
    tag: 'Savings',
    isPlaceholder: true,
  },
  {
    id: 'insight-ai',
    type: 'financial_health',
    title: 'AI financial advice',
    summary:
      'LangChain-powered health scores and personalized guidance will appear here after you run an assessment.',
    tag: 'AI · Coming soon',
    isPlaceholder: true,
  },
]
