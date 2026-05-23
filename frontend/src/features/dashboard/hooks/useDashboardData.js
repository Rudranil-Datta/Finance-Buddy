import { useCallback, useEffect, useState } from 'react'
import { analyticsApi, budgetsApi, aiApi } from '@/api'
import { DEFAULT_RECENT_TRANSACTIONS_LIMIT } from '@/utils/constants.js'
import {
  buildInsightsFromApi,
  normalizeAiInsight,
} from '@/features/ai/utils/aiHelpers.js'
import { shouldUseMockFallback } from '@/utils/mockData.js'
import {
  mockDashboardSummary,
  mockMonthlyTrend,
  mockCategorySpending,
  mockRecentTransactions,
  mockBudgetStatuses,
  mockPlaceholderInsights,
} from '../data/dashboardMock.js'

function normalizeRecent(item) {
  return {
    id: item._id ?? item.id,
    description: item.description || 'Transaction',
    amount: item.amount,
    type: item.type,
    date: item.date,
    categoryName: item.categoryName ?? item.category?.name ?? 'Uncategorized',
    categoryColor: item.categoryColor ?? item.category?.color ?? '#94a3b8',
  }
}

function normalizeBudgetStatus(item) {
  const cat = item.budget?.categoryId
  const categoryName =
    typeof cat === 'object' && cat?.name ? cat.name : 'Budget'
  const color = typeof cat === 'object' && cat?.color ? cat.color : '#94a3b8'

  return {
    id: item.budget?._id ?? item.budget?.id,
    categoryName,
    color,
    spent: item.spent ?? 0,
    limitAmount: item.limitAmount ?? 0,
    pctUsed: item.pctUsed ?? 0,
    isOver: Boolean(item.isOver),
    isWarning: Boolean(item.isWarning),
    period: item.budget?.period,
  }
}

function computeExpenseDelta(monthlyTrend) {
  if (!monthlyTrend?.length || monthlyTrend.length < 2) {
    return { change: null, trend: null }
  }
  const sorted = [...monthlyTrend].sort((a, b) =>
    String(a.period).localeCompare(String(b.period)),
  )
  const last = sorted[sorted.length - 1]
  const prev = sorted[sorted.length - 2]
  const diff = (last.expense ?? last.total ?? 0) - (prev.expense ?? prev.total ?? 0)
  const pct =
    prev.expense || prev.total
      ? (diff / (prev.expense ?? prev.total)) * 100
      : null

  return {
    change: pct != null ? `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%` : null,
    trend: diff > 0 ? 'down' : diff < 0 ? 'up' : null,
    changeLabel: 'vs prior month',
  }
}

/**
 * Loads dashboard datasets from backend; falls back to mock on network failure.
 */
export function useDashboardData() {
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState(null)
  const [monthlyTrend, setMonthlyTrend] = useState([])
  const [categorySpending, setCategorySpending] = useState([])
  const [recentTransactions, setRecentTransactions] = useState([])
  const [budgetStatuses, setBudgetStatuses] = useState([])
  const [insights, setInsights] = useState(mockPlaceholderInsights)
  const [expenseDelta, setExpenseDelta] = useState({ change: null, trend: null })
  const [hasLiveAiInsight, setHasLiveAiInsight] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setUsingMock(false)

    try {
      const [
        dashboard,
        recent,
        budgets,
        categories,
        monthly,
        incomeVsExpense,
        aiList,
        aiLatest,
      ] = await Promise.all([
        analyticsApi.getDashboard(),
        analyticsApi.getRecentTransactions({
          limit: DEFAULT_RECENT_TRANSACTIONS_LIMIT,
        }),
        budgetsApi.getStatus(),
        analyticsApi.getCategorySpending(),
        analyticsApi.getMonthlyExpenses(),
        analyticsApi.getIncomeVsExpense(),
        aiApi.list().catch(() => []),
        aiApi.getLatest().catch(() => null),
      ])

      const trend =
        Array.isArray(incomeVsExpense) && incomeVsExpense.length > 0
          ? incomeVsExpense
          : Array.isArray(monthly)
            ? monthly.map((row) => ({
                period: row.period,
                expense: row.totalExpense ?? row.total ?? 0,
                income: 0,
                netSavings: 0,
              }))
            : dashboard?.monthlyExpenses?.map((row) => ({
                period: row.period,
                expense: row.total ?? 0,
                income: 0,
                netSavings: 0,
              })) ?? []

      setSummary({
        totalIncome: dashboard?.totalIncome ?? 0,
        totalExpense: dashboard?.totalExpense ?? 0,
        netSavings: dashboard?.netSavings ?? 0,
        transactionCount: dashboard?.transactionCount ?? 0,
      })
      setMonthlyTrend(trend)
      setExpenseDelta(computeExpenseDelta(trend))

      const cats =
        Array.isArray(categories) && categories.length > 0
          ? categories
          : dashboard?.topCategories ?? []
      setCategorySpending(cats)

      setRecentTransactions(
        Array.isArray(recent) ? recent.map(normalizeRecent) : [],
      )
      setBudgetStatuses(
        Array.isArray(budgets) ? budgets.map(normalizeBudgetStatus) : [],
      )

      const built = buildInsightsFromApi(aiList, aiLatest)
      setInsights(built)
      const latestNormalized = normalizeAiInsight(aiLatest)
      setHasLiveAiInsight(
        built.some((i) => !i.isPlaceholder && i.healthScore != null) ||
          Boolean(latestNormalized?.healthScore != null),
      )
    } catch (err) {
      setHasLiveAiInsight(false)
      setError(err?.message || 'Could not load dashboard')

      if (shouldUseMockFallback(err)) {
        setUsingMock(true)
        setSummary(mockDashboardSummary)
        setMonthlyTrend(mockMonthlyTrend)
        setExpenseDelta(computeExpenseDelta(mockMonthlyTrend))
        setCategorySpending(mockCategorySpending)
        setRecentTransactions(mockRecentTransactions)
        setBudgetStatuses(mockBudgetStatuses)
        setInsights(mockPlaceholderInsights)
      } else {
        setUsingMock(false)
        setSummary({
          totalIncome: 0,
          totalExpense: 0,
          netSavings: 0,
          transactionCount: 0,
        })
        setMonthlyTrend([])
        setExpenseDelta({ change: null, trend: null })
        setCategorySpending([])
        setRecentTransactions([])
        setBudgetStatuses([])
        setInsights([])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return {
    loading,
    usingMock,
    error,
    summary,
    monthlyTrend,
    categorySpending,
    recentTransactions,
    budgetStatuses,
    insights,
    hasLiveAiInsight,
    expenseDelta,
    refresh: load,
  }
}
