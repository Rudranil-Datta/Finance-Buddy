import { useCallback, useEffect, useState } from 'react'
import { aiApi } from '@/api'
import { isMockDataEnabled } from '@/utils/mockData.js'
import {
  normalizeAiInsight,
  buildMockInsight,
  isInsightFromApi,
} from '../utils/aiHelpers.js'

/**
 * Loads AI insights from the API; mock fallback only on network/API failure.
 */
export function useAiInsights() {
  const [insights, setInsights] = useState([])
  const [latest, setLatest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [lastGeneratedMock, setLastGeneratedMock] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [list, latestData] = await Promise.all([
        aiApi.list(),
        aiApi.getLatest(),
      ])

      const normalizedList = Array.isArray(list)
        ? list.map(normalizeAiInsight).filter(Boolean)
        : []

      const normalizedLatest = normalizeAiInsight(latestData)

      setInsights(normalizedList)
      setLatest(
        normalizedLatest?.healthScore != null
          ? normalizedLatest
          : normalizedList.find((i) => i.healthScore != null) ??
              normalizedLatest,
      )
      setLastGeneratedMock(false)
    } catch (err) {
      setError(err?.message || 'Failed to load AI insights')
      setInsights([])
      setLatest(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const generate = useCallback(async () => {
    setGenerating(true)
    setError(null)
    setLastGeneratedMock(false)

    try {
      const result = await aiApi.generateFinancialHealth()
      const normalized = normalizeAiInsight(result)

      if (normalized?.healthScore != null) {
        await load()
        return {
          mock: false,
          fromCache: Boolean(result?.cached ?? normalized.cached),
          insight: normalized,
        }
      }

      throw new Error(
        'Assessment did not return a health score. Check GOOGLE_API_KEY and try again.',
      )
    } catch (err) {
      if (isMockDataEnabled()) {
        try {
          const mock = await buildMockInsight()
          setLatest(mock)
          setInsights((prev) => {
            const withoutDup = prev.filter((i) => i.id !== mock.id)
            return [mock, ...withoutDup]
          })
          setLastGeneratedMock(true)
          setError(err?.message || 'Using offline demo assessment')
          return { mock: true, fromCache: false }
        } catch (mockErr) {
          setError(mockErr?.message || 'Could not generate insight')
          throw mockErr
        }
      }

      const message =
        err?.message?.includes('timeout')
          ? 'Insight generation timed out. With few transactions you still get a quick assessment — try again, or add more transactions for full AI analysis.'
          : err?.message || 'Could not generate insight'
      setError(message)
      throw err
    } finally {
      setGenerating(false)
    }
  }, [load])

  const healthScore = latest?.healthScore ?? null
  const hasLiveInsight = isInsightFromApi(latest)

  return {
    insights,
    latest,
    healthScore,
    hasLiveInsight,
    loading,
    generating,
    error,
    lastGeneratedMock,
    refresh: load,
    generate,
  }
}
