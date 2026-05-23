import Badge from '@/components/ui/Badge.jsx'
import {
  formatCurrency,
  formatDateShort,
  formatTruncate,
} from '@/utils/format.js'
import { cn } from '@/lib/cn.js'
import TransactionActionsDropdown from './TransactionActionsDropdown.jsx'

export default function TransactionRow({
  transaction,
  currency,
  onEdit,
  onDelete,
}) {
  const isIncome = transaction.type === 'income'

  return (
    <>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: transaction.categoryColor ?? '#94a3b8' }}
            aria-hidden
          >
            {transaction.categoryName?.charAt(0)?.toUpperCase() ?? '?'}
          </span>
          <div className="min-w-0">
            <p className="font-medium text-foreground">
              {formatTruncate(transaction.title || 'Untitled', 40)}
            </p>
            {transaction.notes && (
              <p className="truncate text-xs text-muted-foreground">
                {formatTruncate(transaction.notes, 50)}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        <span className="text-sm text-muted">{transaction.categoryName}</span>
      </td>
      <td className="hidden px-4 py-3 sm:table-cell">
        <Badge variant={isIncome ? 'income' : 'expense'} size="sm">
          {isIncome ? 'Income' : 'Expense'}
        </Badge>
      </td>
      <td className="px-4 py-3 text-sm text-muted">
        {formatDateShort(transaction.date)}
      </td>
      <td
        className={cn(
          'px-4 py-3 text-right text-sm font-semibold tabular-nums',
          isIncome ? 'text-success' : 'text-foreground',
        )}
      >
        {isIncome ? '+' : '−'}
        {formatCurrency(Math.abs(transaction.amount), currency)}
      </td>
      <td className="px-2 py-3 text-right">
        <TransactionActionsDropdown onEdit={onEdit} onDelete={onDelete} />
      </td>
    </>
  )
}
