import { useState } from 'react'
import FormField from '@/components/ui/FormField.jsx'
import Input from '@/components/ui/Input.jsx'
import Select from '@/components/ui/Select.jsx'
import { BUDGET_PERIODS } from '@/utils/constants.js'
import {
  validateBudgetForm,
  toBudgetPayload,
} from '../utils/budgetHelpers.js'

const FORM_ID = 'budget-form'

export default function BudgetForm({
  formId = FORM_ID,
  initialValues,
  categories = [],
  editingId = null,
  existingCategoryIds = [],
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

  function handleSubmit(event) {
    event.preventDefault()
    const { errors: nextErrors, isValid } = validateBudgetForm(form, {
      editingId,
      existingCategoryIds,
    })
    setErrors(nextErrors)
    if (!isValid) return
    onSubmit?.(toBudgetPayload(form))
  }

  const categoryOptions = [
    { value: '', label: 'Select category' },
    ...categories.map((c) => ({
      value: c._id ?? c.id,
      label: c.name,
    })),
  ]

  const periodOptions = BUDGET_PERIODS.map((p) => ({
    value: p,
    label: p.charAt(0).toUpperCase() + p.slice(1),
  }))

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Category" htmlFor="budget-category" required error={errors.categoryId}>
        <Select
          id="budget-category"
          value={form.categoryId}
          onChange={(e) => updateField('categoryId', e.target.value)}
          disabled={Boolean(editingId)}
        >
          {categoryOptions.map((opt) => (
            <option key={opt.value || 'empty'} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Spending limit" htmlFor="budget-limit" required error={errors.limitAmount}>
        <Input
          id="budget-limit"
          type="number"
          min="1"
          step="0.01"
          value={form.limitAmount}
          onChange={(e) => updateField('limitAmount', e.target.value)}
          placeholder="e.g. 500"
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Period" htmlFor="budget-period" required>
          <Select
            id="budget-period"
            value={form.period}
            onChange={(e) => updateField('period', e.target.value)}
          >
            {periodOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Warning threshold"
          htmlFor="budget-threshold"
          hint="Notify when spending reaches this % of limit"
          error={errors.alertThresholdPct}
        >
          <Input
            id="budget-threshold"
            type="number"
            min="50"
            max="100"
            value={form.alertThresholdPct}
            onChange={(e) => updateField('alertThresholdPct', e.target.value)}
          />
        </FormField>
      </div>
    </form>
  )
}

export { FORM_ID as BUDGET_FORM_ID }
