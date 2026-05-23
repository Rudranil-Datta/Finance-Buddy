import {
  DEFAULT_ALERT_THRESHOLD_PCT,
  DEFAULT_BUDGET_PERIOD,
} from '@/utils/constants.js'
import { formatBudgetStatus } from '@/utils/format.js'

export function normalizeBudget(doc) {
  const cat = doc.categoryId
  const categoryId =
    typeof cat === 'object' && cat?._id ? cat._id : doc.categoryId

  return {
    id: doc._id ?? doc.id,
    categoryId: String(categoryId),
    categoryName: typeof cat === 'object' ? cat?.name : undefined,
    categoryColor: typeof cat === 'object' ? cat?.color : '#94a3b8',
    limitAmount: doc.limitAmount,
    period: doc.period ?? DEFAULT_BUDGET_PERIOD,
    alertThresholdPct: doc.alertThresholdPct ?? DEFAULT_ALERT_THRESHOLD_PCT,
    isActive: doc.isActive !== false,
  }
}

/**
 * Map GET /budgets/status item → flat UI model.
 */
export function normalizeBudgetStatus(item) {
  const budget = item.budget ?? item
  const base = normalizeBudget(budget)

  return {
    ...base,
    spent: item.spent ?? 0,
    remaining: item.remaining ?? Math.max(0, base.limitAmount - (item.spent ?? 0)),
    pctUsed: item.pctUsed ?? 0,
    isOver: Boolean(item.isOver),
    isWarning: Boolean(item.isWarning),
    limitAmount: item.limitAmount ?? base.limitAmount,
    alertThresholdPct: item.alertThresholdPct ?? base.alertThresholdPct,
    statusMeta: formatBudgetStatus({
      pctUsed: item.pctUsed,
      isOver: item.isOver,
      isWarning: item.isWarning,
    }),
  }
}

export function budgetTone(item) {
  if (item.isOver) return 'danger'
  if (item.isWarning) return 'warning'
  return 'safe'
}

export function emptyBudgetForm() {
  return {
    categoryId: '',
    limitAmount: '',
    period: DEFAULT_BUDGET_PERIOD,
    alertThresholdPct: String(DEFAULT_ALERT_THRESHOLD_PCT),
  }
}

export function formFromBudget(budget) {
  return {
    categoryId: budget.categoryId,
    limitAmount: String(budget.limitAmount),
    period: budget.period ?? DEFAULT_BUDGET_PERIOD,
    alertThresholdPct: String(
      budget.alertThresholdPct ?? DEFAULT_ALERT_THRESHOLD_PCT,
    ),
  }
}

export function toBudgetPayload(form) {
  return {
    categoryId: form.categoryId,
    limitAmount: Number(form.limitAmount),
    period: form.period,
    alertThresholdPct: Number(form.alertThresholdPct),
    isActive: true,
  }
}

export function validateBudgetForm(form, { editingId, existingCategoryIds = [] } = {}) {
  const errors = {}
  const limit = Number(form.limitAmount)
  const threshold = Number(form.alertThresholdPct)

  if (!form.categoryId) errors.categoryId = 'Category is required'
  else if (
    !editingId &&
    existingCategoryIds.includes(form.categoryId)
  ) {
    errors.categoryId = 'A budget already exists for this category'
  }

  if (!form.limitAmount && form.limitAmount !== 0) {
    errors.limitAmount = 'Limit is required'
  } else if (!Number.isFinite(limit) || limit < 1) {
    errors.limitAmount = 'Limit must be at least 1'
  }

  if (!Number.isFinite(threshold) || threshold < 50 || threshold > 100) {
    errors.alertThresholdPct = 'Alert threshold must be between 50% and 100%'
  }

  return { errors, isValid: Object.keys(errors).length === 0 }
}

export function expenseCategories(categories = []) {
  return categories.filter((c) => c.type === 'expense')
}
