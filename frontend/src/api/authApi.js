import apiClient from './client.js'
import { API_ROUTES } from '@/utils/constants.js'
import { saveAuthSession, clearAuthSession } from '@/utils/storage.js'

/**
 * @typedef {Object} AuthCredentials
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterPayload
 * @property {string} email
 * @property {string} password
 * @property {string} name
 * @property {string} [currency]
 */

/**
 * POST /auth/register — creates account and returns { user, token }.
 */
export async function register(payload) {
  const data = await apiClient.post(API_ROUTES.AUTH.REGISTER, payload)
  if (data?.token) {
    saveAuthSession({ token: data.token, user: data.user })
  }
  return data
}

/**
 * POST /auth/login — returns { user, token }.
 */
export async function login(credentials) {
  const data = await apiClient.post(API_ROUTES.AUTH.LOGIN, credentials)
  if (data?.token) {
    saveAuthSession({ token: data.token, user: data.user })
  }
  return data
}

/**
 * GET /auth/me — current user profile (requires JWT).
 */
export function getMe() {
  return apiClient.get(API_ROUTES.AUTH.ME)
}

/**
 * Logout — clears local session only (no backend endpoint).
 */
export function logout() {
  clearAuthSession()
}
