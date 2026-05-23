import {
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle2,
  PieChart,
  Sparkles,
  Target,
} from 'lucide-react'

export function normalizeNotification(doc) {
  return {
    id: doc._id ?? doc.id,
    type: doc.type,
    title: doc.title,
    message: doc.message,
    read: Boolean(doc.read),
    dueDate: doc.dueDate,
    priority: doc.priority ?? 'medium',
    relatedEntityId: doc.relatedEntityId,
    relatedModel: doc.relatedModel,
    createdAt: doc.createdAt,
  }
}

export function normalizeUpcomingBill(doc) {
  const cat = doc.categoryId
  const { title } = parseBillDescription(doc.description)

  return {
    id: doc._id ?? doc.id,
    title: title || 'Recurring bill',
    amount: doc.amount,
    nextDueDate: doc.nextDueDate,
    recurrenceRule: doc.recurrenceRule,
    categoryName: typeof cat === 'object' ? cat?.name : undefined,
    categoryColor: typeof cat === 'object' ? cat?.color : '#94a3b8',
  }
}

function parseBillDescription(description = '') {
  const text = String(description).trim()
  return { title: text || 'Recurring bill' }
}

export function getNotificationMeta(type) {
  const map = {
    budget_warning: {
      icon: PieChart,
      variant: 'warning',
      label: 'Budget',
    },
    budget_exceeded: {
      icon: AlertTriangle,
      variant: 'danger',
      label: 'Budget',
    },
    bill_due: {
      icon: Calendar,
      variant: 'accent',
      label: 'Bill due',
    },
    goal_milestone: {
      icon: Target,
      variant: 'success',
      label: 'Milestone',
    },
    goal_completed: {
      icon: CheckCircle2,
      variant: 'success',
      label: 'Goal',
    },
    system: {
      icon: Bell,
      variant: 'default',
      label: 'System',
    },
    ai_insight: {
      icon: Sparkles,
      variant: 'accent',
      label: 'Insight',
    },
  }

  return map[type] ?? { icon: Bell, variant: 'default', label: 'Alert' }
}

export function priorityVariant(priority) {
  if (priority === 'high') return 'danger'
  if (priority === 'low') return 'outline'
  return 'warning'
}
