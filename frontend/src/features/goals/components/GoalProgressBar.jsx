import ProgressBar from '@/components/ui/ProgressBar.jsx'
import { formatCurrency, formatPercent } from '@/utils/format.js'
import { goalTone } from '../utils/goalHelpers.js'

export default function GoalProgressBar({
  goal,
  currency = 'USD',
  showAmounts = true,
}) {
  const pct = goal.progress?.progressPct ?? 0
  const tone = goalTone(goal)

  return (
    <div className="space-y-2">
      <ProgressBar
        value={Math.min(pct, 100)}
        max={100}
        tone={tone}
        showLabel
        label="Progress"
      />
      {showAmounts && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <span>
            <span className="font-medium text-foreground">
              {formatCurrency(goal.currentAmount, currency)}
            </span>{' '}
            saved
          </span>
          <span>
            {formatCurrency(goal.progress?.remaining ?? 0, currency)} to go ·{' '}
            {formatPercent(pct)} of {formatCurrency(goal.targetAmount, currency)}
          </span>
        </div>
      )}
    </div>
  )
}
