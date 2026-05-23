import apiClient from './client.js'
import { API_ROUTES } from '@/utils/constants.js'

/**
 * POST /import/csv
 * @param {string} csv — raw CSV text content
 * @returns {Promise<{ imported: number, skipped?: number, source: string, errors?: Array<{ row: number, messages: string[] }> }>}
 */
export function importCsv(csv) {
  return apiClient.post(API_ROUTES.IMPORT.CSV, { csv })
}
