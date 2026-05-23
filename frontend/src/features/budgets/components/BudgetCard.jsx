import { Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card.jsx'
import Badge from '@/components/ui/Badge.jsx'
import Button from '@/components/ui/Button.jsx'
import { formatCurrency } from '@/utils/format.js'
import { cn } from '@/lib/cn.js'
import BudgetProgressBar from './BudgetProgressBar.jsx'

const badgeVariant = {
  danger: 'danger',
  warning: 'warning',
  safe: 'success',
}

export default function BudgetCard({
  budget,
  currency = 'USD',
  onEdit,
  onDelete,
  className,
}) {
  const { statusMeta } = budget
  const variant = badgeVariant[statusMeta?.tone] ?? 'default'

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="mb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: budget.categoryColor }}
              aria-hidden
            />
            <div className="min-w-0">
              <CardTitle className="truncate">{budget.categoryName}</CardTitle>
              <p className="mt-0.5 text-xs capitalize text-muted">
                {budget.period} budget · alert at {budget.alertThresholdPct}%
              </p>
            </div>
          </div>
          <Badge variant={variant} size="sm">
            {statusMeta?.label ?? 'On track'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="mt-4 flex flex-1 flex-col gap-4">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-2xl font-semibold tracking-tight text-foreground">
            {formatCurrency(budget.limitAmount, currency)}
          </p>
          <p className="text-xs text-muted">limit</p>
        </div>

        <BudgetProgressBar budget={budget} currency={currency} />

        <div className="mt-auto flex gap-2 border-t border-border pt-4">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="flex-1"
            leftIcon={<Pencil className="h-3.5 w-3.5" />}
            onClick={() => onEdit?.(budget)}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-danger hover:bg-danger-muted"
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={() => onDelete?.(budget)}
            aria-label={`Delete ${budget.categoryName} budget`}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
