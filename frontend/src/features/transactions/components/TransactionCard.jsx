import { Card } from '@/components/ui/Card.jsx'
import Badge from '@/components/ui/Badge.jsx'
import {
  formatCurrency,
  formatDateShort,
  formatTruncate,
} from '@/utils/format.js'
import { cn } from '@/lib/cn.js'
import TransactionActionsDropdown from './TransactionActionsDropdown.jsx'

export default function TransactionCard({
  transaction,
  currency = 'USD',
  onEdit,
  onDelete,
}) {
  const isIncome = transaction.type === 'income'

  return (
    <Card padding className="md:hidden">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: transaction.categoryColor ?? '#94a3b8' }}
            aria-hidden
          >
            {transaction.categoryName?.charAt(0)?.toUpperCase() ?? '?'}
          </span>
          <div className="min-w-0">
            <p className="font-medium text-foreground">
              {formatTruncate(transaction.title || 'Untitled', 36)}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {transaction.categoryName} · {formatDateShort(transaction.date)}
            </p>
          </div>
        </div>
        <TransactionActionsDropdown onEdit={onEdit} onDelete={onDelete} />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <Badge variant={isIncome ? 'income' : 'expense'} size="sm">
          {isIncome ? 'Income' : 'Expense'}
        </Badge>
        <span
          className={cn(
            'text-sm font-semibold tabular-nums',
            isIncome ? 'text-success' : 'text-foreground',
          )}
        >
          {isIncome ? '+' : '−'}
          {formatCurrency(Math.abs(transaction.amount), currency)}
        </span>
      </div>

      {transaction.notes && (
        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
          {transaction.notes}
        </p>
      )}
    </Card>
  )
}
