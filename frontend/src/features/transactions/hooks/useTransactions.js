import { useCallback, useEffect, useMemo, useState } from 'react'
import { transactionsApi, categoriesApi } from '@/api'
import { MAX_TRANSACTION_LIMIT } from '@/utils/constants.js'
import { normalizeCategory } from '@/utils/categoryHelpers.js'
import {
  normalizeTransaction,
  applyClientFilters,
} from '../utils/transactionHelpers.js'

const DEFAULT_FILTERS = {
  search: '',
  type: '',
  categoryId: '',
  sort: 'newest',
}

/**
 * Fetches transactions + categories; exposes CRUD with optimistic delete/update.
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [loading, setLoading] = useState(true)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true)
    try {
      let catData = await categoriesApi.list()
      let normalized = Array.isArray(catData)
        ? catData.map(normalizeCategory).filter(Boolean)
        : []

      if (normalized.length === 0) {
        catData = await categoriesApi.list()
        normalized = Array.isArray(catData)
          ? catData.map(normalizeCategory).filter(Boolean)
          : []
      }

      setCategories(normalized)
    } catch {
      setCategories([])
    } finally {
      setCategoriesLoading(false)
    }
  }, [])

  const fetchTransactions = useCallback(async (filterOverrides = {}) => {
    setLoading(true)
    setError(null)

    const active = { ...filters, ...filterOverrides }
    const params = { limit: MAX_TRANSACTION_LIMIT }
    if (active.type) params.type = active.type
    if (active.categoryId) params.categoryId = active.categoryId

    try {
      const txData = await transactionsApi.list(params)
      setTransactions(
        Array.isArray(txData) ? txData.map(normalizeTransaction) : [],
      )
    } catch (err) {
      setError(err?.message || 'Failed to load transactions')
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }, [filters.type, filters.categoryId])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const filteredTransactions = useMemo(
    () =>
      applyClientFilters(transactions, {
        search: filters.search,
        sort: filters.sort,
      }),
    [transactions, filters.search, filters.sort],
  )

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  const createTransaction = useCallback(
    async (payload) => {
      setSaving(true)
      try {
        const created = await transactionsApi.create(payload)
        const normalized = normalizeTransaction(created)
        setTransactions((prev) => [normalized, ...prev])
        return normalized
      } finally {
        setSaving(false)
      }
    },
    [],
  )

  const updateTransaction = useCallback(async (id, payload) => {
    setSaving(true)
    try {
      const updated = await transactionsApi.update(id, payload)
      const normalized = normalizeTransaction(updated)
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === id ? normalized : tx)),
      )
      return normalized
    } finally {
      setSaving(false)
    }
  }, [])

  const deleteTransaction = useCallback(async (id) => {
    const previous = transactions
    setTransactions((prev) => prev.filter((tx) => tx.id !== id))

    try {
      await transactionsApi.remove(id)
    } catch (err) {
      setTransactions(previous)
      throw err
    }
  }, [transactions])

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    categories,
    filters,
    setFilter,
    resetFilters,
    loading,
    categoriesLoading,
    saving,
    error,
    refresh: () => Promise.all([loadCategories(), fetchTransactions()]),
    createTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
