import { formatGoalProgress } from '@/utils/format.js'

export function normalizeGoal(doc) {
  const progress = doc.progress ?? {
    progressPct:
      doc.targetAmount > 0
        ? Math.min(100, Math.round((doc.currentAmount / doc.targetAmount) * 1000) / 10)
        : 0,
    remaining: Math.max(0, (doc.targetAmount ?? 0) - (doc.currentAmount ?? 0)),
    isComplete: (doc.currentAmount ?? 0) >= (doc.targetAmount ?? 0),
  }

  return {
    id: doc._id ?? doc.id,
    title: doc.title,
    targetAmount: doc.targetAmount,
    currentAmount: doc.currentAmount ?? 0,
    deadline: doc.deadline,
    milestones: (doc.milestones ?? []).map((m, i) => ({
      id: m._id ?? `m-${i}`,
      label: m.label,
      amount: m.amount,
      reachedAt: m.reachedAt,
    })),
    status: doc.status ?? 'active',
    progress,
    progressLabel: formatGoalProgress(doc.currentAmount, doc.targetAmount).label,
    createdAt: doc.createdAt,
  }
}

export function goalTone(goal) {
  if (goal.status === 'completed' || goal.progress?.isComplete) return 'success'
  if (goal.status === 'paused') return 'warning'
  return 'safe'
}

export function emptyGoalForm() {
  return {
    title: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: '',
    status: 'active',
    milestones: [],
  }
}

export function formFromGoal(goal) {
  return {
    title: goal.title,
    targetAmount: String(goal.targetAmount),
    currentAmount: String(goal.currentAmount ?? 0),
    deadline: goal.deadline ? toDateInputValue(goal.deadline) : '',
    status: goal.status,
    milestones: goal.milestones.map((m) => ({
      label: m.label,
      amount: String(m.amount),
    })),
  }
}

export function toDateInputValue(value) {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

export function toGoalPayload(form) {
  const payload = {
    title: String(form.title).trim(),
    targetAmount: Number(form.targetAmount),
    status: form.status,
    milestones: (form.milestones ?? [])
      .filter((m) => m.label?.trim() && m.amount !== '')
      .map((m) => ({
        label: m.label.trim(),
        amount: Number(m.amount),
      })),
  }

  if (form.deadline) {
    payload.deadline = new Date(form.deadline).toISOString()
  }

  if (form.currentAmount !== '' && form.currentAmount != null) {
    payload.currentAmount = Number(form.currentAmount)
  }

  return payload
}

export function validateGoalForm(form) {
  const errors = {}
  const title = String(form.title ?? '').trim()
  const target = Number(form.targetAmount)

  if (!title) errors.title = 'Title is required'
  if (!form.targetAmount && form.targetAmount !== 0) {
    errors.targetAmount = 'Target amount is required'
  } else if (!Number.isFinite(target) || target < 1) {
    errors.targetAmount = 'Target must be at least 1'
  }

  const current = Number(form.currentAmount)
  if (form.currentAmount !== '' && (!Number.isFinite(current) || current < 0)) {
    errors.currentAmount = 'Current amount cannot be negative'
  }

  return { errors, isValid: Object.keys(errors).length === 0 }
}

export function validateContribution(amount) {
  const value = Number(amount)
  if (!amount && amount !== 0) return 'Amount is required'
  if (!Number.isFinite(value) || value <= 0) {
    return 'Contribution must be greater than zero'
  }
  return null
}
