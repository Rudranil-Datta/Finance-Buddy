const NOTES_DELIMITER = '\n---\n'

/**
 * Map API document → UI model.
 */
export function normalizeTransaction(doc) {
  const cat = doc.categoryId
  const categoryId =
    typeof cat === 'object' && cat?._id ? cat._id : doc.categoryId
  const { title, notes } = parseDescription(doc.description)

  return {
    id: doc._id ?? doc.id,
    title,
    notes,
    description: doc.description ?? '',
    amount: doc.amount,
    type: doc.type,
    categoryId: String(categoryId),
    categoryName: typeof cat === 'object' ? cat?.name : undefined,
    categoryColor: typeof cat === 'object' ? cat?.color : undefined,
    categoryType: typeof cat === 'object' ? cat?.type : undefined,
    date: doc.date,
    source: doc.source,
    spendingType: doc.spendingType,
    isRecurring: doc.isRecurring,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

export function parseDescription(description = '') {
  const text = String(description).trim()
  if (!text.includes(NOTES_DELIMITER)) {
    return { title: text, notes: '' }
  }
  const [title, ...rest] = text.split(NOTES_DELIMITER)
  return { title: title.trim(), notes: rest.join(NOTES_DELIMITER).trim() }
}

export function buildDescription(title, notes) {
  const trimmedTitle = String(title).trim()
  const trimmedNotes = String(notes ?? '').trim()
  if (!trimmedNotes) return trimmedTitle
  return `${trimmedTitle}${NOTES_DELIMITER}${trimmedNotes}`
}

/**
 * Build POST/PATCH body aligned with backend schema.
 */
export function toApiPayload(form) {
  const description = buildDescription(form.title, form.notes)

  return {
    categoryId: form.categoryId,
    amount: Number(form.amount),
    type: form.type,
    description,
    date: new Date(form.date).toISOString(),
    source: 'manual',
    spendingType: 'one_time',
    isRecurring: false,
  }
}

export function validateTransactionForm(form) {
  const errors = {}
  const title = String(form.title ?? '').trim()

  if (!title) errors.title = 'Title is required'
  else if (title.length > 200) errors.title = 'Title must be 200 characters or less'

  const amount = Number(form.amount)
  if (!form.amount && form.amount !== 0) errors.amount = 'Amount is required'
  else if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = 'Amount must be greater than zero'
  }

  if (!form.categoryId) errors.categoryId = 'Category is required'
  if (!form.type) errors.type = 'Type is required'
  if (!form.date) errors.date = 'Date is required'

  const fullDescription = buildDescription(form.title, form.notes)
  if (fullDescription.length > 200) {
    errors.notes = 'Title and notes combined must be 200 characters or less'
  }

  return { errors, isValid: Object.keys(errors).length === 0 }
}

/**
 * Client-side search + sort (API returns date desc, limit 200).
 */
export function applyClientFilters(transactions, { search, sort }) {
  let result = [...transactions]

  if (search?.trim()) {
    const q = search.trim().toLowerCase()
    result = result.filter(
      (tx) =>
        tx.title.toLowerCase().includes(q) ||
        tx.notes.toLowerCase().includes(q) ||
        tx.categoryName?.toLowerCase().includes(q),
    )
  }

  result.sort((a, b) => {
    const da = new Date(a.date).getTime()
    const db = new Date(b.date).getTime()
    return sort === 'oldest' ? da - db : db - da
  })

  return result
}

export function emptyForm(defaultType = 'expense') {
  return {
    title: '',
    amount: '',
    categoryId: '',
    type: defaultType,
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  }
}

export function formFromTransaction(tx) {
  return {
    title: tx.title,
    amount: String(tx.amount),
    categoryId: tx.categoryId,
    type: tx.type,
    date: toDateInputValue(tx.date),
    notes: tx.notes,
  }
}

export function toDateInputValue(value) {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}
