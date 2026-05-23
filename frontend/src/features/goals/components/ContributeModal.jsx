import { useState } from 'react'
import Modal from '@/components/ui/Modal.jsx'
import Button from '@/components/ui/Button.jsx'
import FormField from '@/components/ui/FormField.jsx'
import Input from '@/components/ui/Input.jsx'
import { formatCurrency } from '@/utils/format.js'
import { validateContribution } from '../utils/goalHelpers.js'

export default function ContributeModal({
  open,
  goal,
  currency = 'USD',
  saving = false,
  onClose,
  onSubmit,
}) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState(null)

  if (!goal) return null

  function handleSubmit(event) {
    event.preventDefault()
    const message = validateContribution(amount)
    if (message) {
      setError(message)
      return
    }
    onSubmit?.(Number(amount))
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add contribution"
      description={`Boost progress on "${goal.title}"`}
      size="sm"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="contribute-form" loading={saving}>
            Contribute
          </Button>
        </>
      }
    >
      <form id="contribute-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg border border-border bg-background px-4 py-3 text-sm">
          <p className="text-muted">Current progress</p>
          <p className="mt-1 font-medium text-foreground">
            {formatCurrency(goal.currentAmount, currency)} of{' '}
            {formatCurrency(goal.targetAmount, currency)}
          </p>
        </div>

        <FormField label="Contribution amount" htmlFor="contrib-amount" required error={error}>
          <Input
            id="contrib-amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              if (error) setError(null)
            }}
            placeholder="e.g. 100"
            autoFocus
          />
        </FormField>
      </form>
    </Modal>
  )
}
