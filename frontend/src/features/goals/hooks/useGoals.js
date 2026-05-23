import { useCallback, useEffect, useState } from 'react'
import { goalsApi } from '@/api'
import { normalizeGoal } from '../utils/goalHelpers.js'

/**
 * Savings goals with optional status filter.
 */
export function useGoals(initialStatus = '') {
  const [goals, setGoals] = useState([])
  const [statusFilter, setStatusFilter] = useState(initialStatus)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const fetchGoals = useCallback(async (status = statusFilter) => {
    setLoading(true)
    setError(null)

    try {
      const params = status ? { status } : {}
      const data = await goalsApi.list(params)
      setGoals(Array.isArray(data) ? data.map(normalizeGoal) : [])
    } catch (err) {
      setError(err?.message || 'Failed to load goals')
      setGoals([])
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchGoals(statusFilter)
  }, [fetchGoals, statusFilter])

  const createGoal = useCallback(
    async (payload) => {
      setSaving(true)
      try {
        const created = await goalsApi.create(payload)
        const normalized = normalizeGoal(created)
        setGoals((prev) => [normalized, ...prev])
        return normalized
      } finally {
        setSaving(false)
      }
    },
    [],
  )

  const updateGoal = useCallback(async (id, payload) => {
    setSaving(true)
    try {
      const updated = await goalsApi.update(id, payload)
      const normalized = normalizeGoal(updated)
      setGoals((prev) => prev.map((g) => (g.id === id ? normalized : g)))
      return normalized
    } finally {
      setSaving(false)
    }
  }, [])

  const deleteGoal = useCallback(async (id) => {
    const previous = goals
    setGoals((prev) => prev.filter((g) => g.id !== id))

    try {
      await goalsApi.remove(id)
    } catch (err) {
      setGoals(previous)
      throw err
    }
  }, [goals])

  const contributeToGoal = useCallback(async (id, amount) => {
    setSaving(true)
    try {
      const updated = await goalsApi.contribute(id, { amount: Number(amount) })
      const normalized = normalizeGoal(updated)
      setGoals((prev) => prev.map((g) => (g.id === id ? normalized : g)))
      return normalized
    } finally {
      setSaving(false)
    }
  }, [])

  return {
    goals,
    statusFilter,
    setStatusFilter,
    loading,
    saving,
    error,
    refresh: () => fetchGoals(statusFilter),
    createGoal,
    updateGoal,
    deleteGoal,
    contributeToGoal,
  }
}
