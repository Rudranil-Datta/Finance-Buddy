/**
 * Normalize API category documents for forms and selects.
 */
export function getCategoryId(category) {
  if (!category) return ''
  const raw = category._id ?? category.id ?? category.categoryId
  if (raw == null || raw === '') return ''
  return String(raw)
}

export function normalizeCategory(doc) {
  if (!doc) return null
  const id = getCategoryId(doc)
  if (!id) return null

  return {
    ...doc,
    _id: id,
    id,
    name: doc.name ?? 'Unknown',
    type: doc.type ?? 'expense',
    color: doc.color,
  }
}

/**
 * Categories selectable on a transaction (income / expense only on the API).
 * Discretionary categories are treated as expense for the form.
 */
export function categoriesForTransactionType(categories = [], transactionType) {
  const normalized = categories.map(normalizeCategory).filter(Boolean)

  if (!transactionType) {
    return normalized
  }

  return normalized.filter((category) => {
    if (category.type === transactionType) return true
    return transactionType === 'expense' && category.type === 'discretionary'
  })
}
