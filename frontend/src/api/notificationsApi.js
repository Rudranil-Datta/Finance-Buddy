import apiClient from './client.js'
import { API_ROUTES } from '@/utils/constants.js'

/**
 * GET /notifications
 * @param {{
 *   read?: boolean,
 *   type?: string,
 *   limit?: number,
 * }} [params]
 */
export function list(params = {}) {
  const query = { ...params }
  if (typeof query.read === 'boolean') {
    query.read = query.read ? 'true' : 'false'
  }
  return apiClient.get(API_ROUTES.NOTIFICATIONS.ROOT, { params: query })
}

/**
 * PATCH /notifications/:id/read
 */
export function markRead(id) {
  return apiClient.patch(API_ROUTES.NOTIFICATIONS.READ(id))
}

/**
 * PATCH /notifications/read-all
 */
export function markAllRead() {
  return apiClient.patch(API_ROUTES.NOTIFICATIONS.READ_ALL)
}

/**
 * GET /notifications/upcoming-bills
 * @param {{ days?: number }} [params]
 */
export function getUpcomingBills(params = {}) {
  return apiClient.get(API_ROUTES.NOTIFICATIONS.UPCOMING_BILLS, { params })
}

/**
 * POST /notifications/sync-bill-reminders
 * @param {{ days?: number }} [params]
 */
export function syncBillReminders(params = {}) {
  return apiClient.post(API_ROUTES.NOTIFICATIONS.SYNC_BILL_REMINDERS, {}, { params })
}
