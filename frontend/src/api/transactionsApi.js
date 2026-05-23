import apiClient from './client.js'
import { API_ROUTES } from '@/utils/constants.js'

/**
 * GET /transactions — list with optional filters.
 * @param {{
 *   type?: 'income' | 'expense',
 *   categoryId?: string,
 *   source?: string,
 *   startDate?: Date | string,
 *   endDate?: Date | string,
 *   limit?: number,
 *   isRecurring?: boolean,
 * }} [params]
 */
export function list(params = {}) {
  return apiClient.get(API_ROUTES.TRANSACTIONS.ROOT, { params })
}

/**
 * GET /transactions/:id
 */
export function getById(id) {
  return apiClient.get(API_ROUTES.TRANSACTIONS.BY_ID(id))
}

/**
 * POST /transactions
 */
export function create(payload) {
  return apiClient.post(API_ROUTES.TRANSACTIONS.ROOT, payload)
}

/**
 * PATCH /transactions/:id
 */
export function update(id, payload) {
  return apiClient.patch(API_ROUTES.TRANSACTIONS.BY_ID(id), payload)
}

/**
 * DELETE /transactions/:id
 */
export function remove(id) {
  return apiClient.delete(API_ROUTES.TRANSACTIONS.BY_ID(id))
}

/**
 * GET /transactions/recurring/upcoming
 * @param {{ days?: number }} [params]
 */
export function listUpcomingRecurring(params = {}) {
  return apiClient.get(API_ROUTES.TRANSACTIONS.RECURRING_UPCOMING, { params })
}
