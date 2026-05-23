import Modal from '@/components/ui/Modal.jsx'
import Button from '@/components/ui/Button.jsx'
import { formatCurrency } from '@/utils/format.js'

export default function GoalDeleteModal({
  open,
  goal,
  currency = 'USD',
  loading = false,
  onClose,
  onConfirm,
}) {
  if (!goal) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete goal?"
      description="Progress and milestones for this goal will be permanently removed."
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
        <p className="font-medium text-foreground">{goal.title}</p>
        <p className="mt-1 text-muted">
          {formatCurrency(goal.currentAmount, currency)} of{' '}
          {formatCurrency(goal.targetAmount, currency)} saved
        </p>
      </div>
    </Modal>
  )
}
