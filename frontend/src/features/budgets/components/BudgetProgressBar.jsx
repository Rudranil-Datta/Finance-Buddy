import ProgressBar from '@/components/ui/ProgressBar.jsx'
import { formatCurrency, formatPercent } from '@/utils/format.js'
import { budgetTone } from '../utils/budgetHelpers.js'

export default function BudgetProgressBar({
  budget,
  currency = 'USD',
  showAmounts = true,
}) {
  const tone = budgetTone(budget)
  const pct = Math.min(budget.pctUsed ?? 0, 100)

  return (
    <div className="space-y-2">
      <ProgressBar value={pct} max={100} tone={tone} />
      {showAmounts && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <span>
            <span className="font-medium text-foreground">
              {formatCurrency(budget.spent, currency)}
            </span>{' '}
            spent
          </span>
          <span>
            {budget.isOver ? (
              <span className="font-medium text-danger">
                {formatCurrency(Math.abs(budget.remaining), currency)} over
              </span>
            ) : (
              <>
                <span className="font-medium text-foreground">
                  {formatCurrency(budget.remaining, currency)}
                </span>{' '}
                left · {formatPercent(budget.pctUsed)} used
              </>
            )}
          </span>
        </div>
      )}
    </div>
  )
}
