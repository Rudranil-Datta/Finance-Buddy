import {
  buildInsightsFromApi,
  normalizeAiInsight,
} from '@/features/ai/utils/aiHelpers.js'
import {
  mockCategorySpending,
  mockMonthlyTrend,
  mockPlaceholderInsights,
} from '@/features/dashboard/data/dashboardMock.js'

export const DATE_PRESETS = [
  { value: '3m', label: 'Last 3 months' },
  { value: '6m', label: 'Last 6 months' },
  { value: '12m', label: 'Last 12 months' },
  { value: 'ytd', label: 'Year to date' },
  { value: 'custom', label: 'Custom range' },
]

export const DEFAULT_ANALYTICS_FILTERS = {
  preset: '6m',
  startDate: '',
  endDate: '',
  categoryId: '',
}

/**
 * Compute ISO date range from preset or explicit inputs.
 */
export function resolveDateRange({ preset, startDate, endDate }) {
  const end = endDate ? new Date(endDate) : new Date()
  end.setHours(23, 59, 59, 999)

  if (preset === 'custom' && startDate) {
    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    }
  }

  const start = new Date(end)
  start.setHours(0, 0, 0, 0)

  if (preset === 'ytd') {
    start.setMonth(0, 1)
  } else {
    const months = preset === '3m' ? 3 : preset === '12m' ? 12 : 6
    start.setMonth(start.getMonth() - months)
  }

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  }
}

export function buildApiParams(filters) {
  const range = resolveDateRange(filters)
  const params = {
    startDate: range.startDate,
    endDate: range.endDate,
  }
  return { params, range }
}

export function filterByCategory(rows, categoryId) {
  if (!categoryId) return rows
  return rows.filter(
    (row) => String(row.categoryId) === String(categoryId),
  )
}

/** @deprecated Use normalizeAiInsight from @/features/ai/utils/aiHelpers */
export function normalizeInsight(item) {
  return normalizeAiInsight(item)
}

export function buildInsights(aiList, latest) {
  return buildInsightsFromApi(aiList, latest)
}

export function getAnalyticsMockBundle() {
  return {
    summary: {
      totalIncome: 8420,
      totalExpense: 5280.45,
      netSavings: 3139.55,
      transactionCount: 47,
    },
    monthlyTrend: mockMonthlyTrend,
    categorySpending: mockCategorySpending,
    incomeVsExpense: mockMonthlyTrend,
    topCategories: mockCategorySpending.slice(0, 5),
    savingsGoals: [],
    insights: mockPlaceholderInsights,
  }
}

/**
 * Monthly rows for summary cards (newest first).
 */
export function toMonthlySummaries(incomeVsExpense = []) {
  return [...incomeVsExpense]
    .sort((a, b) => String(b.period).localeCompare(String(a.period)))
    .map((row) => ({
      period: row.period,
      income: row.income ?? 0,
      expense: row.expense ?? row.totalExpense ?? row.total ?? 0,
      netSavings: row.netSavings ?? (row.income ?? 0) - (row.expense ?? row.totalExpense ?? row.total ?? 0),
    }))
}
