import { useCallback, useEffect, useState } from 'react'
import { reportsApi, analyticsApi } from '@/api'
import { toMonthlySummaries } from '@/features/analytics/utils/analyticsHelpers.js'
import { shouldUseMockFallback } from '@/utils/mockData.js'
import {
  buildReportParams,
  DEFAULT_REPORT_FILTERS,
  getReportMockData,
} from '../utils/reportHelpers.js'

/**
 * Report summary + category/monthly data for tables and CSV export.
 */
export function useReports(initialFilters = DEFAULT_REPORT_FILTERS) {
  const [filters, setFilters] = useState(initialFilters)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [usingMock, setUsingMock] = useState(false)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState(null)
  const [categorySpending, setCategorySpending] = useState([])
  const [monthlySummaries, setMonthlySummaries] = useState([])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setUsingMock(false)

    const params = buildReportParams(filters)

    try {
      const [summaryData, categories, incomeVsExpense] = await Promise.all([
        reportsApi.getSummary(params),
        analyticsApi.getCategorySpending(params),
        analyticsApi.getIncomeVsExpense(params),
      ])

      setSummary({
        totalIncome: summaryData?.totalIncome ?? 0,
        totalExpense: summaryData?.totalExpense ?? 0,
        netSavings: summaryData?.netSavings ?? 0,
        transactionCount: summaryData?.transactionCount ?? 0,
      })
      setCategorySpending(Array.isArray(categories) ? categories : [])
      setMonthlySummaries(toMonthlySummaries(incomeVsExpense ?? []))
    } catch (err) {
      setError(err?.message || 'Could not load reports')

      if (shouldUseMockFallback(err)) {
        setUsingMock(true)
        const mock = getReportMockData()
        setSummary(mock.summary)
        setCategorySpending(mock.categorySpending)
        setMonthlySummaries(mock.monthlySummaries)
      } else {
        setUsingMock(false)
        setSummary({
          totalIncome: 0,
          totalExpense: 0,
          netSavings: 0,
          transactionCount: 0,
        })
        setCategorySpending([])
        setMonthlySummaries([])
      }
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    load()
  }, [load])

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_REPORT_FILTERS)
  }, [])

  const exportTransactions = useCallback(async () => {
    setExporting(true)
    try {
      const params = buildReportParams(filters)
      await reportsApi.exportAndDownloadCsv(
        params,
        `transactions-${new Date().toISOString().slice(0, 10)}.csv`,
      )
    } finally {
      setExporting(false)
    }
  }, [filters])

  return {
    filters,
    setFilter,
    resetFilters,
    loading,
    exporting,
    usingMock,
    error,
    summary,
    categorySpending,
    monthlySummaries,
    reportParams: buildReportParams(filters),
    refresh: load,
    exportTransactions,
  }
}
