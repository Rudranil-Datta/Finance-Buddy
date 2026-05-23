import apiClient from './client.js'
import { API_ROUTES } from '@/utils/constants.js'

/**
 * GET /categories — list user categories.
 * @param {{ type?: 'income' | 'expense' | 'discretionary' }} [params]
 */
export function list(params = {}) {
  return apiClient.get(API_ROUTES.CATEGORIES.ROOT, { params })
}

/**
 * POST /categories — create category.
 * @param {{ name: string, type: string, color?: string, icon?: string, slug?: string }} payload
 */
export function create(payload) {
  return apiClient.post(API_ROUTES.CATEGORIES.ROOT, payload)
}
