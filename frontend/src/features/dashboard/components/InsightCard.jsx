import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Lightbulb,
  PiggyBank,
  Sparkles,
  TrendingDown,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import Badge from '@/components/ui/Badge.jsx'
import { ROUTES } from '@/app/router/paths.js'
import { formatRelative } from '@/utils/format.js'
import { cn } from '@/lib/cn.js'

const TYPE_META = {
  financial_health: {
    icon: Sparkles,
    accent: 'text-accent',
    bg: 'bg-accent-muted',
  },
  spending_pattern: {
    icon: TrendingDown,
    accent: 'text-accent',
    bg: 'bg-accent-muted',
  },
  savings_tip: {
    icon: PiggyBank,
    accent: 'text-success',
    bg: 'bg-success-muted',
  },
  anomaly: {
    icon: AlertTriangle,
    accent: 'text-warning',
    bg: 'bg-warning-muted',
  },
  default: {
    icon: Lightbulb,
    accent: 'text-muted',
    bg: 'bg-background',
  },
}

export default function InsightCard({
  title,
  summary,
  type = 'default',
  tag,
  healthScore,
  tips = [],
  isPlaceholder = false,
  href,
  model,
  createdAt,
  className,
}) {
  const meta = TYPE_META[type] ?? TYPE_META.default
  const Icon = meta.icon
  const linkTarget = href ?? (isPlaceholder ? null : ROUTES.AI)

  const card = (
    <Card
      className={cn(
        'flex h-full flex-col transition-shadow',
        linkTarget && 'hover:shadow-[var(--shadow-elevated)]',
        isPlaceholder && 'border-dashed',
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
          {tag && (
            <Badge variant={isPlaceholder ? 'outline' : 'accent'} size="sm">
              {tag}
            </Badge>
          )}
        </div>
        <CardTitle className="mt-3 text-base">{title}</CardTitle>
        {healthScore != null && (
          <CardDescription>
            Health score{' '}
            <span className="font-semibold text-foreground">{healthScore}</span>/100
          </CardDescription>
        )}
        {createdAt && !isPlaceholder && (
          <CardDescription>{formatRelative(createdAt)}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm leading-relaxed text-muted">{summary}</p>
        {tips.length > 0 && (
          <ul className="mt-3 space-y-1 border-t border-border pt-3 text-xs text-muted">
            {tips.slice(0, 2).map((tip) => (
              <li key={tip} className="flex gap-2">
                <span className="text-accent">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        )}
        {isPlaceholder && (
          <p className="mt-3 text-[10px] uppercase tracking-wide text-muted-foreground">
            Generate an assessment in AI Insights
          </p>
        )}
        {model && !isPlaceholder && (
          <p className="mt-3 text-[10px] uppercase tracking-wide text-muted-foreground">
            Model · {model}
          </p>
        )}
      </CardContent>
    </Card>
  )

  if (!linkTarget) {
    return card
  }

  return (
    <Link
      to={linkTarget}
      className="block h-full rounded-[var(--radius-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {card}
    </Link>
  )
}
