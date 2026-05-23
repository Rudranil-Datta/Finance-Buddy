/**
 * CSV import parsing and validation (aligned with backend csvImportMapper).
 */

import { buildDescription } from '@/features/transactions/utils/transactionHelpers.js'
import { normalizeCategory } from '@/utils/categoryHelpers.js'

export const CSV_COLUMNS = [
  'title',
  'amount',
  'category',
  'transaction type',
  'date',
  'notes',
]

const CSV_SAMPLE = `title,amount,category,transaction type,date,notes
Monthly salary,85000,Salary,income,2026-03-01,Payroll deposit
Grocery run,2450.75,Food,expense,2026-03-02,
Uber ride,385.50,Transport,expense,2026-03-03,Airport trip`

const COLUMN_ALIASES = {
  title: ['title', 'description', 'desc', 'name', 'memo'],
  amount: ['amount', 'value', 'total'],
  category: ['category', 'category_name', 'category name'],
  type: ['type', 'transaction_type', 'transaction type', 'transactiontype'],
  date: ['date', 'transaction_date', 'transaction date'],
  notes: ['notes', 'note', 'comment', 'comments'],
}

export const MAX_IMPORT_ROWS = 500

export function getSampleCsv() {
  return CSV_SAMPLE
}

function parseCsvLine(line) {
  const cols = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }
    if (ch === ',' && !inQuotes) {
      cols.push(current.trim())
      current = ''
      continue
    }
    current += ch
  }
  cols.push(current.trim())
  return cols
}

function normalizeHeader(header) {
  return String(header ?? '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

function buildColumnIndex(headers) {
  const index = {}
  const normalized = headers.map(normalizeHeader)

  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    const idx = normalized.findIndex((h) => aliases.includes(h))
    if (idx >= 0) index[field] = idx
  }

  return index
}

export function normalizeTransactionType(raw) {
  const value = String(raw ?? '')
    .trim()
    .toLowerCase()
  if (!value) return null
  if (['income', 'in', 'credit', 'deposit', 'salary'].includes(value)) return 'income'
  if (['expense', 'out', 'debit', 'spend', 'payment'].includes(value)) return 'expense'
  return null
}

function parseAmount(raw) {
  if (raw == null || raw === '') return null
  const amount = parseFloat(String(raw).replace(/[^0-9.-]/g, ''))
  if (!Number.isFinite(amount) || amount <= 0) return null
  return Math.round(Math.abs(amount) * 100) / 100
}

function parseDate(raw) {
  const value = String(raw ?? '').trim()
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

function categoryMatchesType(category, transactionType) {
  if (!category) return false
  if (category.type === transactionType) return true
  return transactionType === 'expense' && category.type === 'discretionary'
}

function resolveCategory(categoryName, transactionType, categories) {
  const name = String(categoryName ?? '').trim()
  if (!name) return { category: null, error: null }

  const match = categories.find(
    (c) =>
      categoryMatchesType(c, transactionType) &&
      c.name.toLowerCase() === name.toLowerCase(),
  )

  if (match) return { category: match, error: null }

  return {
    category: null,
    error: `Unknown category "${name}" for ${transactionType}`,
  }
}

function pickDefaultCategory(transactionType, categories) {
  return categories.find((c) => categoryMatchesType(c, transactionType)) || null
}

function validateRow(row, columnIndex, rowIndex, categories) {
  const get = (field) => {
    const idx = columnIndex[field]
    return idx >= 0 ? row[idx] ?? '' : ''
  }

  const errors = []
  const warnings = []

  const titleRaw = get('title')
  const title = String(titleRaw).trim() || 'CSV import'
  const notes = String(get('notes')).trim()
  const amount = parseAmount(get('amount'))
  const date = parseDate(get('date'))
  const dateStr = String(get('date')).trim()
  const typeRaw = get('type')
  const type = normalizeTransactionType(typeRaw) || 'expense'

  if (!titleRaw.trim()) warnings.push('Missing title')
  if (amount == null) errors.push('Amount must be a positive number')
  if (!date) errors.push('Valid date is required')

  if (typeRaw.trim() && !normalizeTransactionType(typeRaw)) {
    errors.push('Transaction type must be income or expense')
  } else if (!typeRaw.trim()) {
    warnings.push('Defaulting to expense')
  }

  let categoryName = ''
  let categoryId = ''

  if (errors.length === 0) {
    const { category, error: categoryError } = resolveCategory(
      get('category'),
      type,
      categories,
    )

    if (categoryError) {
      errors.push(categoryError)
    } else {
      let resolved = category
      if (!resolved) {
        resolved = pickDefaultCategory(type, categories)
        if (!resolved) {
          errors.push(`No ${type} category available`)
        } else {
          categoryName = resolved.name
          categoryId = resolved.id
          warnings.push(
            get('category').trim()
              ? `Using default: ${resolved.name}`
              : `Category not set — using ${resolved.name}`,
          )
        }
      } else {
        categoryName = category.name
        categoryId = category.id
      }
    }
  }

  const description = buildDescription(title, notes)
  if (errors.length === 0 && description.length > 200) {
    errors.push('Title and notes must be 200 characters or less combined')
  }

  return {
    rowIndex,
    title,
    notes,
    amount,
    type,
    categoryName,
    categoryId,
    date,
    dateStr,
    description,
    errors,
    warnings,
    isValid: errors.length === 0,
  }
}

/**
 * Parse CSV text into preview rows with validation.
 * @param {string} csvContent
 * @param {Array} categories — normalized user categories
 */
export function parseCsvForPreview(csvContent, categories = []) {
  const normalizedCategories = categories.map(normalizeCategory).filter(Boolean)

  const trimmed = String(csvContent ?? '').trim()
  if (!trimmed) {
    return { rows: [], fileError: 'File is empty', validCount: 0, invalidCount: 0 }
  }

  const lines = trimmed.split(/\r?\n/).filter((line) => line.trim())
  if (lines.length < 2) {
    return {
      rows: [],
      fileError: 'CSV must include a header row and at least one data row',
      validCount: 0,
      invalidCount: 0,
    }
  }

  const headers = parseCsvLine(lines[0])
  const columnIndex = buildColumnIndex(headers)

  if (columnIndex.amount == null || columnIndex.date == null) {
    return {
      rows: [],
      fileError:
        'CSV must include "amount" and "date" columns (title, category, transaction type, and notes are optional)',
      validCount: 0,
      invalidCount: 0,
    }
  }

  const dataLines = []
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i])
    if (!cols.every((c) => !c)) dataLines.push(cols)
  }

  if (dataLines.length === 0) {
    return {
      rows: [],
      fileError: 'No data rows found in CSV',
      validCount: 0,
      invalidCount: 0,
    }
  }

  if (dataLines.length > MAX_IMPORT_ROWS) {
    return {
      rows: [],
      fileError: `CSV exceeds maximum of ${MAX_IMPORT_ROWS} data rows`,
      validCount: 0,
      invalidCount: 0,
    }
  }

  if (!normalizedCategories.length) {
    return {
      rows: [],
      fileError: 'Load your categories before importing (sign in and refresh)',
      validCount: 0,
      invalidCount: 0,
    }
  }

  const rows = dataLines.map((cols, i) =>
    validateRow(cols, columnIndex, i + 2, normalizedCategories),
  )

  const validCount = rows.filter((r) => r.isValid).length
  const invalidCount = rows.length - validCount

  return {
    rows,
    fileError: null,
    validCount,
    invalidCount,
  }
}

export function formatPreviewDate(value) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatTransactionType(type) {
  if (type === 'income') return 'Income'
  if (type === 'expense') return 'Expense'
  return type || '—'
}
