import Modal from '@/components/ui/Modal.jsx'
import Button from '@/components/ui/Button.jsx'
import { formatCurrency, formatTruncate } from '@/utils/format.js'

export default function DeleteConfirmationModal({
  open,
  onClose,
  onConfirm,
  transaction,
  currency = 'USD',
  loading = false,
}) {
  if (!transaction) return null

  const isIncome = transaction.type === 'income'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete transaction?"
      description="This action cannot be undone. Budget totals will be recalculated."
      size="sm"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            loading={loading}
            onClick={onConfirm}
          >
            Delete
          </Button>
        </>
      }
    >
      <div className="rounded-lg border border-border bg-background px-4 py-3 text-sm">
        <p className="font-medium text-foreground">
          {formatTruncate(transaction.title || 'Transaction', 48)}
        </p>
        <p className="mt-1 text-muted">
          {transaction.categoryName} ·{' '}
          <span className={isIncome ? 'text-success' : 'text-foreground'}>
            {isIncome ? '+' : '−'}
            {formatCurrency(Math.abs(transaction.amount), currency)}
          </span>
        </p>
      </div>
    </Modal>
  )
}
