import { analyticsApi } from '@/api'
import { mockPlaceholderInsights } from '@/features/dashboard/data/dashboardMock.js'

export const AI_CACHE_TTL_HOURS = 24

const TYPE_LABELS = {
  financial_health: 'Financial health',
  spending_pattern: 'Spending pattern',
  savings_tip: 'Savings tip',
}

/**
 * Whether a persisted insight is still within the 24h server cache window.
 */
export function isCacheValid(item) {
  if (!item) return false
  if (item.expiresAt) {
    return new Date(item.expiresAt) > new Date()
  }
  return item.cached === true
}

/**
 * True when the insight has a real persisted score from the API (not local mock).
 */
export function isInsightFromApi(item) {
  if (!item || item.isMock) return false
  return item.healthScore != null && item.fromApi !== false
}

/**
 * Map API insight → UI model (shared across AI page, dashboard, analytics).
 */
export function normalizeAiInsight(item) {
  if (!item) return null

  const healthScore = item.healthScore ?? null
  const fromApi = healthScore != null && !item.isMock
  const cacheValid = fromApi && isCacheValid(item)

  let tag
  if (item.isMock) {
    tag = 'Demo'
  } else if (cacheValid) {
    tag = `Cached · ${AI_CACHE_TTL_HOURS}h`
  } else if (fromApi && item.model) {
    tag = item.model
  } else if (item.cached === false && !healthScore) {
    tag = 'Snapshot'
  } else if (fromApi) {
    tag = 'AI'
  }

  return {
    id: item._id ?? item.id ?? `insight-${item.createdAt ?? Date.now()}`,
    type: item.type ?? 'financial_health',
    title: TYPE_LABELS[item.type] ?? 'Insight',
    healthScore,
    summary: item.summary ?? '',
    tips: Array.isArray(item.tips) ? item.tips : [],
    debtAdvice: item.debtAdvice ?? '',
    savingsAdvice: item.savingsAdvice ?? '',
    literacyTip: item.literacyTip ?? '',
    inputSnapshot: item.inputSnapshot ?? {},
    model: item.model ?? null,
    expiresAt: item.expiresAt ?? null,
    cached: cacheValid,
    cacheExpired: Boolean(fromApi && item.expiresAt && !cacheValid),
    fromApi,
    isMock: Boolean(item.isMock),
    isPlaceholder: false,
    tag,
    createdAt: item.createdAt ?? new Date().toISOString(),
  }
}

/**
 * Build insight cards for dashboard / analytics from list + latest API payloads.
 */
export function buildInsightsFromApi(aiList, latest, { limit = 4 } = {}) {
  const fromList = Array.isArray(aiList)
    ? aiList.map(normalizeAiInsight).filter((row) => row?.healthScore != null)
    : []

  if (fromList.length > 0) {
    return fromList.slice(0, limit)
  }

  const normalizedLatest = normalizeAiInsight(latest)
  if (normalizedLatest?.healthScore != null) {
    return [normalizedLatest]
  }

  return mockPlaceholderInsights
}

function scoreFromSummary(summary) {
  const income = summary?.totalIncome ?? 0
  const expense = summary?.totalExpense ?? 0
  const net = summary?.netSavings ?? income - expense

  if (income <= 0 && expense <= 0) return 50

  const savingsRate = income > 0 ? (net / income) * 100 : 0
  let score = 55 + savingsRate * 0.9

  if (expense > income) score -= 15
  if (savingsRate >= 20) score += 8
  if (savingsRate >= 30) score += 5

  return Math.min(98, Math.max(12, Math.round(score)))
}

function buildTips(summary) {
  const income = summary?.totalIncome ?? 0
  const expense = summary?.totalExpense ?? 0
  const net = summary?.netSavings ?? income - expense
  const tips = []

  if (income > 0) {
    const rate = Math.round((net / income) * 100)
    if (rate < 10) {
      tips.push(
        'Savings rate is below 10% — review discretionary categories for quick wins.',
      )
    } else if (rate >= 25) {
      tips.push(
        `Strong savings rate at ${rate}% — consider allocating more toward goals.`,
      )
    } else {
      tips.push(
        `Savings rate is ${rate}% — steady progress with room to optimize recurring bills.`,
      )
    }
  }

  if (expense > income) {
    tips.push(
      'Spending exceeded income this period — prioritize essential categories first.',
    )
  } else {
    tips.push(
      'Set a weekly spending check-in to catch category drift before month-end.',
    )
  }

  tips.push(
    'Revisit budget limits for your top three expense categories this month.',
  )

  return tips.slice(0, 4)
}

function buildSummary(summary, score) {
  const income = summary?.totalIncome ?? 0
  const expense = summary?.totalExpense ?? 0
  const net = summary?.netSavings ?? income - expense

  if (income <= 0 && expense <= 0) {
    return 'Add transactions to unlock a data-driven financial health assessment.'
  }

  const tone =
    score >= 75 ? 'solid' : score >= 55 ? 'moderate' : 'needs attention'

  return `Your financial health score is ${score}/100 (${tone}). Income ${formatCompact(income)} vs expenses ${formatCompact(expense)} leaves ${formatCompact(net)} net for the current period.`
}

function formatCompact(n) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

/**
 * Client-side fallback only when the API is unreachable.
 */
export async function buildMockInsight() {
  let summary = {
    totalIncome: 0,
    totalExpense: 0,
    netSavings: 0,
  }

  try {
    summary = await analyticsApi.getDashboard()
  } catch {
    summary = {
      totalIncome: 4200,
      totalExpense: 3100,
      netSavings: 1100,
    }
  }

  const healthScore = scoreFromSummary(summary)
  const tips = buildTips(summary)

  return normalizeAiInsight({
    id: `mock-${Date.now()}`,
    type: 'financial_health',
    healthScore,
    summary: buildSummary(summary, healthScore),
    tips,
    inputSnapshot: {
      totalIncome: summary.totalIncome,
      totalExpense: summary.totalExpense,
      netSavings: summary.netSavings,
    },
    model: 'local-heuristic',
    isMock: true,
    cached: false,
    createdAt: new Date().toISOString(),
  })
}

export function getScoreTone(score) {
  if (score == null) return { label: 'Not scored', variant: 'outline' }
  if (score >= 80) return { label: 'Excellent', variant: 'success' }
  if (score >= 65) return { label: 'Good', variant: 'accent' }
  if (score >= 50) return { label: 'Fair', variant: 'warning' }
  return { label: 'Needs work', variant: 'danger' }
}

/**
 * Human-readable cache expiry for UI badges.
 */
export function formatCacheExpiry(expiresAt) {
  if (!expiresAt) return null
  const ms = new Date(expiresAt) - Date.now()
  if (ms <= 0) return 'Cache expired'
  const hours = Math.floor(ms / (60 * 60 * 1000))
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))
  if (hours > 0) return `Refreshes in ${hours}h ${minutes}m`
  return `Refreshes in ${minutes}m`
}
