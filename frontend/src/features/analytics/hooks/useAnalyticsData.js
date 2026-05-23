import { useCallback, useEffect, useMemo, useState } from 'react'
import { analyticsApi, aiApi, categoriesApi } from '@/api'
import { DEFAULT_TOP_CATEGORIES_LIMIT } from '@/utils/constants.js'
import { shouldUseMockFallback } from '@/utils/mockData.js'
import {
  buildApiParams,
  buildInsights,
  DEFAULT_ANALYTICS_FILTERS,
  filterByCategory,
  getAnalyticsMockBundle,
  toMonthlySummaries,
} from '../utils/analyticsHelpers.js'

/**
 * Analytics dashboard data with date/category filters and mock fallback.
 */
export function useAnalyticsData(initialFilters = DEFAULT_ANALYTICS_FILTERS) {
  const [filters, setFilters] = useState(initialFilters)
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState(null)
  const [monthlyTrend, setMonthlyTrend] = useState([])
  const [categorySpending, setCategorySpending] = useState([])
  const [incomeVsExpense, setIncomeVsExpense] = useState([])
  const [topCategories, setTopCategories] = useState([])
  const [savingsGoals, setSavingsGoals] = useState([])
  const [insights, setInsights] = useState([])
  const [categories, setCategories] = useState([])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setUsingMock(false)

    const { params } = buildApiParams(filters)

    try {
      const [
        dashboard,
        monthly,
        categoriesData,
        incomeExpense,
        topCats,
        savings,
        expenseCategories,
        aiList,
        aiLatest,
      ] = await Promise.all([
        analyticsApi.getDashboard(params),
        analyticsApi.getMonthlyExpenses(params),
        analyticsApi.getCategorySpending(params),
        analyticsApi.getIncomeVsExpense(params),
        analyticsApi.getTopCategories({
          ...params,
          limit: DEFAULT_TOP_CATEGORIES_LIMIT,
        }),
        analyticsApi.getSavingsTrends(),
        categoriesApi.list().catch(() => []),
        aiApi.list().catch(() => []),
        aiApi.getLatest().catch(() => null),
      ])

      const trend =
        Array.isArray(incomeExpense) && incomeExpense.length > 0
          ? incomeExpense
          : Array.isArray(monthly)
            ? monthly.map((row) => ({
                period: row.period,
                expense: row.totalExpense ?? row.total ?? 0,
                income: 0,
                netSavings: 0,
              }))
            : []

      setSummary({
        totalIncome: dashboard?.totalIncome ?? 0,
        totalExpense: dashboard?.totalExpense ?? 0,
        netSavings: dashboard?.netSavings ?? 0,
        transactionCount: dashboard?.transactionCount ?? 0,
      })
      setMonthlyTrend(trend)
      setIncomeVsExpense(
        Array.isArray(incomeExpense) && incomeExpense.length > 0
          ? incomeExpense
          : trend,
      )
      setCategorySpending(
        Array.isArray(categoriesData) ? categoriesData : dashboard?.topCategories ?? [],
      )
      setTopCategories(
        Array.isArray(topCats) ? topCats : dashboard?.topCategories ?? [],
      )
      setSavingsGoals(Array.isArray(savings) ? savings : dashboard?.savingsGoals ?? [])
      setCategories(
        Array.isArray(expenseCategories)
          ? expenseCategories.filter((c) => c.type === 'expense')
          : [],
      )
      setInsights(buildInsights(aiList, aiLatest))
    } catch (err) {
      setError(err?.message || 'Could not load analytics')

      if (shouldUseMockFallback(err)) {
        setUsingMock(true)
        const mock = getAnalyticsMockBundle()
        setSummary(mock.summary)
        setMonthlyTrend(mock.monthlyTrend)
        setIncomeVsExpense(mock.incomeVsExpense)
        setCategorySpending(mock.categorySpending)
        setTopCategories(mock.topCategories)
        setSavingsGoals(mock.savingsGoals)
        setInsights(mock.insights)
        setCategories([])
      } else {
        setUsingMock(false)
        setSummary({
          totalIncome: 0,
          totalExpense: 0,
          netSavings: 0,
          transactionCount: 0,
        })
        setMonthlyTrend([])
        setIncomeVsExpense([])
        setCategorySpending([])
        setTopCategories([])
        setSavingsGoals([])
        setInsights([])
        setCategories([])
      }
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    load()
  }, [load])

  const filteredCategories = useMemo(
    () => filterByCategory(categorySpending, filters.categoryId),
    [categorySpending, filters.categoryId],
  )

  const filteredTopCategories = useMemo(
    () => filterByCategory(topCategories, filters.categoryId),
    [topCategories, filters.categoryId],
  )

  const monthlySummaries = useMemo(
    () => toMonthlySummaries(incomeVsExpense),
    [incomeVsExpense],
  )

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_ANALYTICS_FILTERS)
  }, [])

  return {
    filters,
    setFilter,
    resetFilters,
    loading,
    usingMock,
    error,
    summary,
    monthlyTrend,
    categorySpending: filteredCategories,
    allCategorySpending: categorySpending,
    incomeVsExpense,
    topCategories: filteredTopCategories,
    monthlySummaries,
    savingsGoals,
    insights,
    categories,
    refresh: load,
  }
}
