import apiClient from './client.js'
import { API_ROUTES } from '@/utils/constants.js'

/**
 * GET /budgets
 */
export function list() {
  return apiClient.get(API_ROUTES.BUDGETS.ROOT)
}

/**
 * GET /budgets/status — spent vs limit with warning flags.
 */
export function getStatus() {
  return apiClient.get(API_ROUTES.BUDGETS.STATUS)
}

/**
 * GET /budgets/:id
 */
export function getById(id) {
  return apiClient.get(API_ROUTES.BUDGETS.BY_ID(id))
}

/**
 * POST /budgets
 * @param {{
 *   categoryId: string,
 *   limitAmount: number,
 *   period?: 'weekly' | 'monthly',
 *   alertThresholdPct?: number,
 *   isActive?: boolean,
 * }} payload
 */
export function create(payload) {
  return apiClient.post(API_ROUTES.BUDGETS.ROOT, payload)
}

/**
 * PATCH /budgets/:id
 */
export function update(id, payload) {
  return apiClient.patch(API_ROUTES.BUDGETS.BY_ID(id), payload)
}

/**
 * DELETE /budgets/:id
 */
export function remove(id) {
  return apiClient.delete(API_ROUTES.BUDGETS.BY_ID(id))
}
