const ApiError = require('../utils/ApiError');
const { parseCsv } = require('../utils/csvParser');
const { mapCsvRows } = require('../utils/csvImportMapper');
const { Transaction, Category } = require('../models');

const MAX_CSV_BYTES = 2 * 1024 * 1024;

/**
 * Parse CSV, validate rows, and insert valid transactions.
 */
async function importCsv(userId, csvContent) {
  const content = String(csvContent ?? '');
  if (!content.trim()) {
    throw new ApiError(400, 'CSV content is required');
  }
  if (Buffer.byteLength(content, 'utf8') > MAX_CSV_BYTES) {
    throw new ApiError(400, 'CSV file must be under 2 MB');
  }

  const parsed = parseCsv(content);
  if (parsed.error) {
    throw new ApiError(400, parsed.error);
  }

  const categories = await Category.find({ userId }).lean();
  if (!categories.length) {
    throw new ApiError(
      400,
      'No categories found. Register or create categories before importing.',
    );
  }

  const mapped = mapCsvRows(parsed.headers, parsed.rows, categories);
  if (mapped.error) {
    throw new ApiError(400, mapped.error);
  }

  const { valid, invalid } = mapped;

  if (!valid.length) {
    throw new ApiError(
      400,
      `No valid rows found in CSV (${invalid.length} row${invalid.length === 1 ? '' : 's'} had errors)`,
    );
  }

  const docs = valid.map((row) => ({
    userId,
    ...row.doc,
  }));

  const inserted = await Transaction.insertMany(docs, { ordered: false });

  return {
    imported: inserted.length,
    skipped: invalid.length,
    source: 'csv',
    errors:
      invalid.length > 0
        ? invalid.map((row) => ({
            row: row.rowNumber,
            messages: row.errors,
          }))
        : undefined,
  };
}

module.exports = { importCsv, MAX_CSV_BYTES };
