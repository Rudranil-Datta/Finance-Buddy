import Modal from '@/components/ui/Modal.jsx'
import Button from '@/components/ui/Button.jsx'
import { formatCurrency } from '@/utils/format.js'

export default function BudgetDeleteModal({
  open,
  budget,
  currency = 'USD',
  loading = false,
  onClose,
  onConfirm,
}) {
  if (!budget) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete budget?"
      description="Spending limits and alerts for this category will be removed."
      size="sm"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="button" variant="danger" loading={loading} onClick={onConfirm}>
            Delete
          </Button>
        </>
      }
    >
      <div className="rounded-lg border border-border bg-background px-4 py-3 text-sm">
        <p className="font-medium text-foreground">{budget.categoryName}</p>
        <p className="mt-1 text-muted">
          {formatCurrency(budget.limitAmount, currency)} {budget.period} limit ·{' '}
          {formatCurrency(budget.spent, currency)} spent
        </p>
      </div>
    </Modal>
  )
}
