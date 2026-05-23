const { buildDescription } = require('./transactionDescription');

const COLUMN_ALIASES = {
  title: ['title', 'description', 'desc', 'name', 'memo'],
  amount: ['amount', 'value', 'total'],
  category: ['category', 'category_name', 'category name'],
  type: ['type', 'transaction_type', 'transaction type', 'transactiontype'],
  date: ['date', 'transaction_date', 'transaction date'],
  notes: ['notes', 'note', 'comment', 'comments'],
};

const MAX_IMPORT_ROWS = 500;

function normalizeHeader(header) {
  return String(header ?? '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

function buildColumnIndex(headers) {
  const index = {};
  const normalized = headers.map(normalizeHeader);

  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    const idx = normalized.findIndex((h) => aliases.includes(h));
    if (idx >= 0) index[field] = idx;
  }

  return index;
}

function normalizeTransactionType(raw) {
  const value = String(raw ?? '')
    .trim()
    .toLowerCase();
  if (!value) return null;
  if (['income', 'in', 'credit', 'deposit', 'salary'].includes(value)) return 'income';
  if (['expense', 'out', 'debit', 'spend', 'payment'].includes(value)) return 'expense';
  return null;
}

function parseAmount(raw) {
  if (raw == null || raw === '') return null;
  const amount = parseFloat(String(raw).replace(/[^0-9.-]/g, ''));
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.round(Math.abs(amount) * 100) / 100;
}

function parseDate(raw) {
  const value = String(raw ?? '').trim();
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function categoryMatchesType(category, transactionType) {
  if (!category) return false;
  if (category.type === transactionType) return true;
  return transactionType === 'expense' && category.type === 'discretionary';
}

function resolveCategory(categoryName, transactionType, categories) {
  const name = String(categoryName ?? '').trim();
  if (!name) return { category: null, error: null };

  const match = categories.find(
    (c) =>
      categoryMatchesType(c, transactionType) &&
      c.name.toLowerCase() === name.toLowerCase(),
  );

  if (match) return { category: match, error: null };

  return {
    category: null,
    error: `Unknown category "${name}" for ${transactionType}`,
  };
}

function pickDefaultCategory(transactionType, categories) {
  const match = categories.find((c) => categoryMatchesType(c, transactionType));
  return match || null;
}

/**
 * Map a CSV data row to a validated transaction draft.
 * @returns {{ ok: true, doc: object } | { ok: false, errors: string[], warnings: string[] }}
 */
function mapRowToTransaction(row, columnIndex, rowNumber, categories) {
  const get = (field) => {
    const idx = columnIndex[field];
    return idx >= 0 ? row[idx] ?? '' : '';
  };

  const errors = [];
  const warnings = [];

  const titleRaw = get('title');
  const title = String(titleRaw).trim() || 'CSV import';
  const notes = String(get('notes')).trim();
  const amount = parseAmount(get('amount'));
  const date = parseDate(get('date'));
  const type = normalizeTransactionType(get('type')) || 'expense';

  if (!titleRaw.trim()) warnings.push('Missing title — using "CSV import"');
  if (amount == null) errors.push('Amount must be a positive number');
  if (!date) errors.push('Valid date is required');

  if (!normalizeTransactionType(get('type')) && !get('type').trim()) {
    warnings.push('Missing transaction type — defaulting to expense');
  } else if (get('type').trim() && !normalizeTransactionType(get('type'))) {
    errors.push('Transaction type must be income or expense');
  }

  if (errors.length > 0) {
    return { ok: false, rowNumber, errors, warnings };
  }

  const { category, error: categoryError } = resolveCategory(
    get('category'),
    type,
    categories,
  );

  if (categoryError) {
    return { ok: false, rowNumber, errors: [categoryError], warnings };
  }

  let resolvedCategory = category;
  if (!resolvedCategory) {
    resolvedCategory = pickDefaultCategory(type, categories);
    if (!resolvedCategory) {
      return {
        ok: false,
        rowNumber,
        errors: [`No ${type} category available — create categories first`],
        warnings,
      };
    }
    if (get('category').trim()) {
      warnings.push(`Using default category: ${resolvedCategory.name}`);
    } else {
      warnings.push(`No category specified — using ${resolvedCategory.name}`);
    }
  }

  const description = buildDescription(title, notes);
  if (description.length > 200) {
    return {
      ok: false,
      rowNumber,
      errors: ['Title and notes combined must be 200 characters or less'],
      warnings,
    };
  }

  return {
    ok: true,
    rowNumber,
    warnings,
    preview: {
      title,
      notes,
      amount,
      type,
      categoryName: resolvedCategory.name,
      categoryId: resolvedCategory._id,
      date,
      dateStr: get('date'),
    },
    doc: {
      categoryId: resolvedCategory._id,
      amount,
      type,
      description,
      date,
      source: 'csv',
      spendingType: 'one_time',
      isRecurring: false,
    },
  };
}

function mapCsvRows(headers, rows, categories) {
  const columnIndex = buildColumnIndex(headers);

  if (columnIndex.amount == null || columnIndex.date == null) {
    return {
      error:
        'CSV must include at least "amount" and "date" columns (see title, category, transaction type, notes)',
      valid: [],
      invalid: [],
    };
  }

  if (rows.length > MAX_IMPORT_ROWS) {
    return {
      error: `CSV exceeds maximum of ${MAX_IMPORT_ROWS} data rows`,
      valid: [],
      invalid: [],
    };
  }

  const valid = [];
  const invalid = [];

  rows.forEach((row, i) => {
    const rowNumber = i + 2;
    const result = mapRowToTransaction(row, columnIndex, rowNumber, categories);
    if (result.ok) {
      valid.push(result);
    } else {
      invalid.push(result);
    }
  });

  return { error: null, valid, invalid, columnIndex };
}

module.exports = {
  MAX_IMPORT_ROWS,
  COLUMN_ALIASES,
  buildColumnIndex,
  mapCsvRows,
  normalizeTransactionType,
  parseAmount,
  parseDate,
};
