/**
 * Reusable CSV building and browser download utilities.
 */

export function escapeCsvCell(value) {
  if (value == null) return ''
  const str = String(value)
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * @param {string[]} headers
 * @param {Array<Array<string|number|null|undefined>>} rows
 */
export function rowsToCsv(headers, rows) {
  const lines = [headers.map(escapeCsvCell).join(',')]
  for (const row of rows) {
    lines.push(row.map(escapeCsvCell).join(','))
  }
  return lines.join('\n')
}

/**
 * Trigger download of CSV string in the browser.
 */
export function downloadCsv(content, filename = 'export.csv') {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export function downloadCsvFromRows(headers, rows, filename = 'export.csv') {
  downloadCsv(rowsToCsv(headers, rows), filename)
}

/**
 * Build a dated filename prefix for exports.
 */
export function exportFilename(prefix, extension = 'csv') {
  const date = new Date().toISOString().slice(0, 10)
  return `${prefix}-${date}.${extension}`
}
