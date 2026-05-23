import { useEffect, useState } from 'react'
import Input from '@/components/ui/Input.jsx'
import Select from '@/components/ui/Select.jsx'
import Textarea from '@/components/ui/Textarea.jsx'
import FormField from '@/components/ui/FormField.jsx'
import {
  getCategoryId,
  categoriesForTransactionType,
} from '@/utils/categoryHelpers.js'
import {
  validateTransactionForm,
  emptyForm,
} from '../utils/transactionHelpers.js'

export default function TransactionForm({
  initialValues,
  categories = [],
  categoriesLoading = false,
  onSubmit,
  formId = 'transaction-form',
}) {
  const [form, setForm] = useState(initialValues ?? emptyForm())
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setForm(initialValues ?? emptyForm())
    setErrors({})
  }, [initialValues])

  const filteredCategories = categoriesForTransactionType(categories, form.type)

  function updateField(key, value) {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'type') {
        const stillValid = categoriesForTransactionType(categories, value).some(
          (c) => getCategoryId(c) === prev.categoryId,
        )
        if (!stillValid) next.categoryId = ''
      }
      return next
    })
    if (errors[key]) {
      setErrors((e) => {
        const next = { ...e }
        delete next[key]
        return next
      })
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    const { errors: nextErrors, isValid } = validateTransactionForm(form)
    setErrors(nextErrors)
    if (!isValid) return
    onSubmit?.(form)
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField label="Title" htmlFor="tx-title" required error={errors.title}>
        <Input
          id="tx-title"
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="e.g. Grocery run"
          error={Boolean(errors.title)}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Amount" htmlFor="tx-amount" required error={errors.amount}>
          <Input
            id="tx-amount"
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={(e) => updateField('amount', e.target.value)}
            placeholder="0.00"
            error={Boolean(errors.amount)}
          />
        </FormField>

        <FormField label="Date" htmlFor="tx-date" required error={errors.date}>
          <Input
            id="tx-date"
            type="date"
            value={form.date}
            onChange={(e) => updateField('date', e.target.value)}
            error={Boolean(errors.date)}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Type" htmlFor="tx-type" required error={errors.type}>
          <Select
            id="tx-type"
            value={form.type}
            onChange={(e) => updateField('type', e.target.value)}
            error={Boolean(errors.type)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>
        </FormField>

        <FormField
          label="Category"
          htmlFor="tx-category"
          required
          error={errors.categoryId}
          hint={
            categoriesLoading
              ? 'Loading your categories…'
              : filteredCategories.length === 0
                ? 'Categories could not be loaded. Refresh the page or try again in a moment.'
                : undefined
          }
        >
          <Select
            id="tx-category"
            value={form.categoryId}
            onChange={(e) => updateField('categoryId', e.target.value)}
            error={Boolean(errors.categoryId)}
            disabled={categoriesLoading || filteredCategories.length === 0}
          >
            <option value="">
              {categoriesLoading ? 'Loading categories…' : 'Select category'}
            </option>
            {filteredCategories.map((cat) => {
              const id = getCategoryId(cat)
              return (
                <option key={id} value={id}>
                  {cat.name}
                </option>
              )
            })}
          </Select>
        </FormField>
      </div>

      <FormField
        label="Notes"
        htmlFor="tx-notes"
        hint="Optional — stored with the transaction"
        error={errors.notes}
      >
        <Textarea
          id="tx-notes"
          rows={3}
          value={form.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Add context for this transaction…"
          error={Boolean(errors.notes)}
        />
      </FormField>
    </form>
  )
}
