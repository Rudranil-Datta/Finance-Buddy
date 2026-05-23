import Badge from '@/components/ui/Badge.jsx'
import { formatCacheExpiry } from '../utils/aiHelpers.js'

/**
 * Shows 24h cache status for a persisted Gemini assessment.
 */
export default function CacheStatusBadge({ insight }) {
  if (!insight?.healthScore || insight.isMock) return null

  if (insight.cached) {
    const expiryLabel = formatCacheExpiry(insight.expiresAt)
    return (
      <Badge variant="accent" size="sm" title={expiryLabel ?? undefined}>
        Cached · 24h
      </Badge>
    )
  }

  if (insight.cacheExpired) {
    return (
      <Badge variant="outline" size="sm">
        Expired — regenerate
      </Badge>
    )
  }

  return null
}
