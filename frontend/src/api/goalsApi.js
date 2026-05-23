import apiClient from './client.js'
import { API_ROUTES } from '@/utils/constants.js'

/**
 * GET /goals
 * @param {{ status?: 'active' | 'completed' | 'paused' }} [params]
 */
export function list(params = {}) {
  return apiClient.get(API_ROUTES.GOALS.ROOT, { params })
}

/**
 * GET /goals/:id
 */
export function getById(id) {
  return apiClient.get(API_ROUTES.GOALS.BY_ID(id))
}

/**
 * POST /goals
 */
export function create(payload) {
  return apiClient.post(API_ROUTES.GOALS.ROOT, payload)
}

/**
 * PATCH /goals/:id
 */
export function update(id, payload) {
  return apiClient.patch(API_ROUTES.GOALS.BY_ID(id), payload)
}

/**
 * DELETE /goals/:id
 */
export function remove(id) {
  return apiClient.delete(API_ROUTES.GOALS.BY_ID(id))
}

/**
 * POST /goals/:id/contribute
 * @param {{ amount: number }} payload
 */
export function contribute(id, payload) {
  return apiClient.post(API_ROUTES.GOALS.CONTRIBUTE(id), payload)
}
