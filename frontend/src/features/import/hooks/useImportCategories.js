import { useCallback, useEffect, useState } from 'react'
import { categoriesApi } from '@/api'
import { normalizeCategory } from '@/utils/categoryHelpers.js'

/**
 * User categories for CSV preview resolution (real accounts, not seed-only).
 */
export function useImportCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await categoriesApi.list()
      const list = Array.isArray(data) ? data : data?.categories ?? []
      setCategories(list.map(normalizeCategory).filter(Boolean))
    } catch (err) {
      setError(err?.message || 'Could not load categories')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { categories, loading, error, refresh: load }
}
