import apiClient from './client.js'
import { API_ROUTES } from '@/utils/constants.js'

/**
 * GET /reports/summary
 * @param {{ startDate?: Date | string, endDate?: Date | string }} [params]
 */
export function getSummary(params = {}) {
  return apiClient.get(API_ROUTES.REPORTS.SUMMARY, { params })
}

/**
 * GET /reports/export — CSV file as Blob.
 * @param {{ startDate?: Date | string, endDate?: Date | string, type?: string, categoryId?: string }} [params]
 */
export async function exportCsv(params = {}) {
  return apiClient.getBlob(API_ROUTES.REPORTS.EXPORT, { params })
}

const DEFAULT_EXPORT_FILENAME = 'finance-buddy-export.csv'

/**
 * Trigger browser download for a CSV blob (no UI dependency).
 */
export function downloadCsvBlob(blob, filename = DEFAULT_EXPORT_FILENAME) {
  if (!(blob instanceof Blob)) {
    throw new TypeError('exportCsv must return a Blob before download')
  }
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

/**
 * Fetch and download CSV in one step.
 */
export async function exportAndDownloadCsv(params = {}, filename = DEFAULT_EXPORT_FILENAME) {
  const { blob } = await exportCsv(params)
  downloadCsvBlob(blob, filename)
}
