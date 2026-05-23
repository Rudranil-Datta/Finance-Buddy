import { useCallback, useEffect, useState } from 'react'
import { budgetsApi, categoriesApi } from '@/api'
import { normalizeCategory } from '@/utils/categoryHelpers.js'
import {
  normalizeBudget,
  normalizeBudgetStatus,
  expenseCategories,
} from '../utils/budgetHelpers.js'

/**
 * Budget list with live spending status from GET /budgets/status.
 */
export function useBudgets() {
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [statusData, catData] = await Promise.all([
        budgetsApi.getStatus(),
        categoriesApi.list().catch(() => []),
      ])

      setBudgets(
        Array.isArray(statusData)
          ? statusData.map(normalizeBudgetStatus)
          : [],
      )
      const normalized = Array.isArray(catData)
        ? catData.map(normalizeCategory).filter(Boolean)
        : []
      setCategories(expenseCategories(normalized))
    } catch (err) {
      setError(err?.message || 'Failed to load budgets')
      setBudgets([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const createBudget = useCallback(
    async (payload) => {
      setSaving(true)
      try {
        await budgetsApi.create(payload)
        await fetchAll()
      } finally {
        setSaving(false)
      }
    },
    [fetchAll],
  )

  const updateBudget = useCallback(
    async (id, payload) => {
      setSaving(true)
      try {
        await budgetsApi.update(id, payload)
        await fetchAll()
      } finally {
        setSaving(false)
      }
    },
    [fetchAll],
  )

  const deleteBudget = useCallback(
    async (id) => {
      const previous = budgets
      setBudgets((prev) => prev.filter((b) => b.id !== id))

      try {
        await budgetsApi.remove(id)
      } catch (err) {
        setBudgets(previous)
        throw err
      }
    },
    [budgets],
  )

  return {
    budgets,
    categories,
    loading,
    saving,
    error,
    refresh: fetchAll,
    createBudget,
    updateBudget,
    deleteBudget,
  }
}
