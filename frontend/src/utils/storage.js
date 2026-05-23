import { STORAGE_KEYS } from './constants.js'

/**
 * Token persistence (JWT).
 */
export function getToken() {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN)
  } catch {
    return null
  }
}

export function setToken(token) {
  if (!token) {
    clearToken()
    return
  }
  localStorage.setItem(STORAGE_KEYS.TOKEN, token)
}

export function clearToken() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
}

export function hasToken() {
  return Boolean(getToken())
}

/**
 * Cached user profile (optional; refreshed via GET /auth/me).
 */
export function getUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    clearUser()
    return null
  }
}

export function setUser(user) {
  if (!user) {
    clearUser()
    return
  }
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export function clearUser() {
  localStorage.removeItem(STORAGE_KEYS.USER)
}

/**
 * Persist auth session after login/register.
 */
export function saveAuthSession({ token, user }) {
  setToken(token)
  if (user) setUser(user)
}

/**
 * Clear all auth-related storage (logout / 401).
 */
export function clearAuthSession() {
  clearToken()
  clearUser()
}
