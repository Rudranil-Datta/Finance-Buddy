import { formatCurrencyCompact, formatPeriod } from '@/utils/format.js'

export default function DefaultChartTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-[var(--shadow-elevated)]">
      <p className="font-medium text-foreground">{formatPeriod(label)}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="mt-1 text-muted">
          <span
            className="mr-1.5 inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}:{' '}
          <span className="font-medium text-foreground">
            {formatCurrencyCompact(entry.value, currency)}
          </span>
        </p>
      ))}
    </div>
  )
}
