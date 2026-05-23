import { DEFAULT_CURRENCY } from './constants.js'

const currencyFormatters = new Map()

function getCurrencyFormatter(currency = DEFAULT_CURRENCY, options = {}) {
  const key = `${currency}-${JSON.stringify(options)}`
  if (!currencyFormatters.has(key)) {
    currencyFormatters.set(
      key,
      new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        ...options,
      }),
    )
  }
  return currencyFormatters.get(key)
}

/**
 * Format monetary amounts (user currency from profile).
 */
export function formatCurrency(amount, currency = DEFAULT_CURRENCY, options = {}) {
  const value = Number(amount)
  if (!Number.isFinite(value)) return '—'
  return getCurrencyFormatter(currency, options).format(value)
}

/**
 * Compact currency for charts (e.g. $1.2K).
 */
export function formatCurrencyCompact(amount, currency = DEFAULT_CURRENCY) {
  const value = Number(amount)
  if (!Number.isFinite(value)) return '—'
  return getCurrencyFormatter(currency, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value)
}

const dateFormatterCache = new Map()

function getDateFormatter(locale, options) {
  const key = `${locale}-${JSON.stringify(options)}`
  if (!dateFormatterCache.has(key)) {
    dateFormatterCache.set(key, new Intl.DateTimeFormat(locale, options))
  }
  return dateFormatterCache.get(key)
}

/**
 * Format ISO/date values for display.
 */
export function formatDate(value, options = {}) {
  if (value == null || value === '') return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  const { locale, ...intlOptions } = options
  return getDateFormatter(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...intlOptions,
  }).format(date)
}

/**
 * Short date for tables (e.g. Mar 5, 2026).
 */
export function formatDateShort(value, locale) {
  return formatDate(value, { locale, month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Month label from period string "2026-03" → "Mar 2026".
 */
export function formatPeriod(period) {
  if (!period || typeof period !== 'string') return '—'
  const [year, month] = period.split('-')
  if (!year || !month) return period
  const date = new Date(Number(year), Number(month) - 1, 1)
  if (Number.isNaN(date.getTime())) return period
  return getDateFormatter(undefined, { month: 'short', year: 'numeric' }).format(date)
}

/**
 * Relative time (e.g. "2 days ago") — simple fallback without heavy deps.
 */
export function formatRelative(value) {
  if (value == null) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  const diffMs = date.getTime() - Date.now()
  const absSec = Math.abs(Math.round(diffMs / 1000))
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

  if (absSec < 60) return rtf.format(Math.round(diffMs / 1000), 'second')
  const absMin = Math.abs(Math.round(diffMs / 60000))
  if (absMin < 60) return rtf.format(Math.round(diffMs / 60000), 'minute')
  const absHr = Math.abs(Math.round(diffMs / 3600000))
  if (absHr < 24) return rtf.format(Math.round(diffMs / 3600000), 'hour')
  const absDay = Math.abs(Math.round(diffMs / 86400000))
  if (absDay < 30) return rtf.format(Math.round(diffMs / 86400000), 'day')
  return formatDate(date)
}

/**
 * Percentage for budgets, goals, analytics.
 */
export function formatPercent(value, options = {}) {
  const num = Number(value)
  if (!Number.isFinite(num)) return '—'
  const { decimals = 1, signed = false } = options
  const formatted = `${Math.abs(num).toFixed(decimals)}%`
  if (signed && num > 0) return `+${formatted}`
  if (signed && num < 0) return `-${formatted}`
  return formatted
}

/**
 * Budget usage: map pctUsed + flags to display label.
 */
export function formatBudgetStatus({ pctUsed, isOver, isWarning }) {
  if (isOver) return { label: 'Over budget', tone: 'danger' }
  if (isWarning) return { label: `${formatPercent(pctUsed)} used`, tone: 'warning' }
  return { label: `${formatPercent(pctUsed)} used`, tone: 'safe' }
}

/**
 * Analytics: signed change between two values.
 */
export function formatDelta(current, previous, options = {}) {
  const curr = Number(current)
  const prev = Number(previous)
  if (!Number.isFinite(curr) || !Number.isFinite(prev)) {
    return { value: '—', percent: null, direction: 'neutral' }
  }
  const diff = curr - prev
  const percent = prev !== 0 ? (diff / Math.abs(prev)) * 100 : null
  const direction = diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral'

  const { currency = DEFAULT_CURRENCY, asCurrency = true } = options
  const value = asCurrency
    ? formatCurrency(Math.abs(diff), currency)
    : String(Math.abs(Math.round(diff * 100) / 100))

  return {
    value: `${diff >= 0 ? '+' : '-'}${value}`,
    percent: percent != null ? formatPercent(percent, { signed: true }) : null,
    direction,
    raw: diff,
  }
}

/**
 * Chart axis / tooltip numbers.
 */
export function formatCompactNumber(value) {
  const num = Number(value)
  if (!Number.isFinite(num)) return '—'
  return new Intl.NumberFormat(undefined, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num)
}

/**
 * Goal progress percentage (0–100+).
 */
export function formatGoalProgress(currentAmount, targetAmount) {
  const current = Number(currentAmount)
  const target = Number(targetAmount)
  if (!Number.isFinite(current) || !Number.isFinite(target) || target <= 0) {
    return { percent: 0, label: '0%' }
  }
  const pct = Math.min(Math.round((current / target) * 1000) / 10, 999)
  return { percent: pct, label: formatPercent(pct) }
}

/**
 * Truncate long descriptions for tables.
 */
export function formatTruncate(text, maxLength = 40) {
  if (!text) return ''
  const str = String(text)
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength - 1)}…`
}
