import { Check } from 'lucide-react'
import { formatCurrency } from '@/utils/format.js'
import { cn } from '@/lib/cn.js'

export default function MilestoneTrack({ milestones = [], currency = 'USD' }) {
  if (!milestones.length) return null

  const sorted = [...milestones].sort((a, b) => a.amount - b.amount)

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted">Milestones</p>
      <ul className="space-y-1.5">
        {sorted.map((m) => {
          const reached = Boolean(m.reachedAt)
          return (
            <li
              key={m.id}
              className={cn(
                'flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs',
                reached
                  ? 'border-success/30 bg-success-muted text-success'
                  : 'border-border bg-background text-muted',
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                  reached
                    ? 'border-success bg-success text-white'
                    : 'border-border bg-surface',
                )}
              >
                {reached && <Check className="h-3 w-3" />}
              </span>
              <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                {m.label}
              </span>
              <span className="shrink-0 tabular-nums">
                {formatCurrency(m.amount, currency)}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
