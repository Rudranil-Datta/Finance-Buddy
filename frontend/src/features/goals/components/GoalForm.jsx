import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import FormField from '@/components/ui/FormField.jsx'
import Input from '@/components/ui/Input.jsx'
import Select from '@/components/ui/Select.jsx'
import Button from '@/components/ui/Button.jsx'
import { GOAL_STATUSES } from '@/utils/constants.js'
import { validateGoalForm, toGoalPayload } from '../utils/goalHelpers.js'

const FORM_ID = 'goal-form'

export default function GoalForm({
  formId = FORM_ID,
  initialValues,
  onSubmit,
}) {
  const [form, setForm] = useState(initialValues)
  const [errors, setErrors] = useState({})

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  function addMilestone() {
    setForm((prev) => ({
      ...prev,
      milestones: [...(prev.milestones ?? []), { label: '', amount: '' }],
    }))
  }

  function updateMilestone(index, field, value) {
    setForm((prev) => {
      const milestones = [...(prev.milestones ?? [])]
      milestones[index] = { ...milestones[index], [field]: value }
      return { ...prev, milestones }
    })
  }

  function removeMilestone(index) {
    setForm((prev) => ({
      ...prev,
      milestones: (prev.milestones ?? []).filter((_, i) => i !== index),
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const { errors: nextErrors, isValid } = validateGoalForm(form)
    setErrors(nextErrors)
    if (!isValid) return
    onSubmit?.(toGoalPayload(form))
  }

  const statusOptions = GOAL_STATUSES.map((s) => ({
    value: s,
    label: s.charAt(0).toUpperCase() + s.slice(1),
  }))

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Goal name" htmlFor="goal-title" required error={errors.title}>
        <Input
          id="goal-title"
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="e.g. Emergency fund"
          maxLength={100}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Target amount"
          htmlFor="goal-target"
          required
          error={errors.targetAmount}
        >
          <Input
            id="goal-target"
            type="number"
            min="1"
            step="0.01"
            value={form.targetAmount}
            onChange={(e) => updateField('targetAmount', e.target.value)}
          />
        </FormField>

        <FormField
          label="Starting amount"
          htmlFor="goal-current"
          hint="Optional starting balance"
          error={errors.currentAmount}
        >
          <Input
            id="goal-current"
            type="number"
            min="0"
            step="0.01"
            value={form.currentAmount}
            onChange={(e) => updateField('currentAmount', e.target.value)}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Deadline" htmlFor="goal-deadline" hint="Optional target date">
          <Input
            id="goal-deadline"
            type="date"
            value={form.deadline}
            onChange={(e) => updateField('deadline', e.target.value)}
          />
        </FormField>

        <FormField label="Status" htmlFor="goal-status">
          <Select
            id="goal-status"
            value={form.status}
            onChange={(e) => updateField('status', e.target.value)}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Milestones</p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={addMilestone}
          >
            Add milestone
          </Button>
        </div>
        {(form.milestones ?? []).map((m, index) => (
          <div key={index} className="flex gap-2">
            <Input
              className="flex-1"
              placeholder="Label"
              value={m.label}
              onChange={(e) => updateMilestone(index, 'label', e.target.value)}
            />
            <Input
              className="w-28"
              type="number"
              min="0"
              placeholder="Amount"
              value={m.amount}
              onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="shrink-0 px-2"
              onClick={() => removeMilestone(index)}
              aria-label="Remove milestone"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </form>
  )
}

export { FORM_ID as GOAL_FORM_ID }
