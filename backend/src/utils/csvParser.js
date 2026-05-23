/**
 * Minimal RFC-style CSV parser (quoted fields, commas).
 */

function parseCsvLine(line) {
  const cols = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ',' && !inQuotes) {
      cols.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  cols.push(current.trim());
  return cols;
}

/**
 * @param {string} csvContent
 * @returns {{ headers: string[], rows: string[][] } | { error: string }}
 */
function parseCsv(csvContent) {
  const trimmed = String(csvContent ?? '').trim();
  if (!trimmed) {
    return { error: 'CSV file is empty' };
  }

  const lines = trimmed.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) {
    return { error: 'CSV must include a header row and at least one data row' };
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.every((c) => !c)) continue;
    rows.push(cols);
  }

  if (rows.length === 0) {
    return { error: 'No data rows found in CSV' };
  }

  return { headers, rows };
}

module.exports = { parseCsv, parseCsvLine };
