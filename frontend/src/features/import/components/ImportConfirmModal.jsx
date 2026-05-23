import Modal from '@/components/ui/Modal.jsx'
import Button from '@/components/ui/Button.jsx'
import { formatCurrency } from '@/utils/format.js'

export default function ImportConfirmModal({
  open,
  validCount = 0,
  invalidCount = 0,
  totalAmount,
  currency = 'USD',
  loading = false,
  onClose,
  onConfirm,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Confirm CSV import"
      description="Valid rows will be saved as transactions. Invalid rows are skipped."
      size="sm"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="button"
            loading={loading}
            disabled={validCount === 0}
            onClick={onConfirm}
          >
            Import {validCount} transactions
          </Button>
        </>
      }
    >
      <div className="space-y-3 rounded-lg border border-border bg-background px-4 py-3 text-sm">
        <p>
          <span className="font-medium text-foreground">{validCount}</span> transaction
          {validCount === 1 ? '' : 's'} will be imported.
        </p>
        {invalidCount > 0 && (
          <p className="text-warning">
            {invalidCount} row{invalidCount === 1 ? '' : 's'} with errors will be skipped.
          </p>
        )}
        {totalAmount > 0 && (
          <p className="text-muted">
            Combined amount:{' '}
            <span className="font-medium text-foreground">
              {formatCurrency(totalAmount, currency)}
            </span>
          </p>
        )}
        <p className="text-xs text-muted">
          Categories and types from your CSV are applied when valid; otherwise defaults are used.
        </p>
      </div>
    </Modal>
  )
}
