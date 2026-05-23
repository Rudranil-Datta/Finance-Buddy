/**
 * Demo/mock UI data is opt-in only (VITE_USE_MOCK_DATA=true).
 * By default, failed API calls show errors and empty states — not fake numbers.
 */
export function isMockDataEnabled() {
  return import.meta.env.VITE_USE_MOCK_DATA === 'true'
}

/**
 * When mock mode is on, only fall back for network failures or server errors —
 * not 401/403/429 (those should surface real messages).
 */
export function shouldUseMockFallback(error) {
  if (!isMockDataEnabled()) return false
  const status = error?.statusCode ?? 0
  return status === 0 || status >= 500
}
