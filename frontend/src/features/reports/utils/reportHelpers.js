import {
  resolveDateRange,
  getAnalyticsMockBundle,
} from '@/features/analytics/utils/analyticsHelpers.js'
import { exportFilename } from '@/utils/csvExport.js'

export const REPORT_DATE_PRESETS = [
  { value: '3m', label: 'Last 3 months' },
  { value: '6m', label: 'Last 6 months' },
  { value: '12m', label: 'Last 12 months' },
  { value: 'ytd', label: 'Year to date' },
  { value: 'custom', label: 'Custom range' },
]

export const DEFAULT_REPORT_FILTERS = {
  preset: '6m',
  startDate: '',
  endDate: '',
}

export const EXPORT_TYPES = [
  { value: 'transactions', label: 'Transactions (API)' },
  { value: 'summary', label: 'Financial summary' },
  { value: 'categories', label: 'Category breakdown' },
  { value: 'monthly', label: 'Monthly summary' },
]

export function buildReportParams(filters) {
  return resolveDateRange(filters)
}

export function getReportMockData() {
  const mock = getAnalyticsMockBundle()
  return {
    summary: mock.summary,
    categorySpending: mock.categorySpending,
    monthlySummaries: mock.incomeVsExpense.map((row) => ({
      period: row.period,
      income: row.income ?? 0,
      expense: row.expense ?? 0,
      netSavings: row.netSavings ?? 0,
    })),
  }
}

export function summaryToCsvRows(summary) {
  return [
    ['Metric', 'Value'],
    ['Total Income', summary?.totalIncome ?? 0],
    ['Total Expenses', summary?.totalExpense ?? 0],
    ['Net Savings', summary?.netSavings ?? 0],
    ['Transaction Count', summary?.transactionCount ?? 0],
  ]
}

export function categoriesToCsvRows(categories = []) {
  const headers = ['Category', 'Total', 'Count', 'Percentage']
  const rows = categories.map((c) => [
    c.categoryName ?? '',
    c.total ?? 0,
    c.count ?? '',
    c.percentage ?? '',
  ])
  return { headers, rows }
}

export function monthlyToCsvRows(monthly = []) {
  const headers = ['Period', 'Income', 'Expenses', 'Net Savings']
  const rows = monthly.map((m) => [
    m.period,
    m.income ?? 0,
    m.expense ?? 0,
    m.netSavings ?? 0,
  ])
  return { headers, rows }
}

export function filenameForExport(type) {
  const map = {
    transactions: 'transactions',
    summary: 'financial-summary',
    categories: 'category-breakdown',
    monthly: 'monthly-summary',
  }
  return exportFilename(map[type] ?? 'report')
}
