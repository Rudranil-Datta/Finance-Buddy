import {
  AlertTriangle,
  Lightbulb,
  PiggyBank,
  Sparkles,
  TrendingDown,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import Badge from '@/components/ui/Badge.jsx'
import { formatRelative } from '@/utils/format.js'
import { cn } from '@/lib/cn.js'
import CacheStatusBadge from './CacheStatusBadge.jsx'

const TYPE_META = {
  financial_health: { icon: Sparkles, accent: 'text-accent', bg: 'bg-accent-muted' },
  spending_pattern: { icon: TrendingDown, accent: 'text-accent', bg: 'bg-accent-muted' },
  savings_tip: { icon: PiggyBank, accent: 'text-success', bg: 'bg-success-muted' },
  default: { icon: Lightbulb, accent: 'text-muted', bg: 'bg-background' },
}

export default function InsightCard({
  title,
  summary,
  type = 'financial_health',
  healthScore,
  tips = [],
  isMock = false,
  cached = false,
  cacheExpired = false,
  expiresAt = null,
  createdAt,
  model,
  className,
}) {
  const meta = TYPE_META[type] ?? TYPE_META.default
  const Icon = meta.icon

  return (
    <Card
      className={cn(
        'flex flex-col transition-shadow hover:shadow-[var(--shadow-elevated)]',
        isMock && 'ring-1 ring-accent/20',
        className,
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
              meta.bg,
              meta.accent,
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </span>
          <div className="flex flex-wrap justify-end gap-1">
            <CacheStatusBadge
              insight={{ healthScore, isMock, cached, cacheExpired, expiresAt }}
            />
            {isMock && (
              <Badge variant="outline" size="sm">
                Demo
              </Badge>
            )}
            {healthScore != null && (
              <Badge variant="accent" size="sm">
                {healthScore}/100
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="mt-3 text-base">{title}</CardTitle>
        {createdAt && (
          <CardDescription>{formatRelative(createdAt)}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm leading-relaxed text-muted">{summary}</p>
        {tips.length > 0 && (
          <ul className="mt-4 space-y-2 border-t border-border pt-4">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm text-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        )}
        {model && (
          <p className="mt-4 text-[10px] uppercase tracking-wide text-muted-foreground">
            Model · {model}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
