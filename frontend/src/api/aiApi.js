import apiClient from './client.js'
import { API_ROUTES, DEFAULT_AI_INSIGHT_TYPE } from '@/utils/constants.js'

/**
 * GET /ai — list recent insights (max 10 from backend).
 */
export function list() {
  return apiClient.get(API_ROUTES.AI.ROOT)
}

/**
 * GET /ai/latest — latest cached or computed insight snapshot.
 * @param {{ type?: 'financial_health' | 'spending_pattern' | 'savings_tip' }} [params]
 */
export function getLatest(params = {}) {
  const type = params.type ?? DEFAULT_AI_INSIGHT_TYPE
  return apiClient.get(API_ROUTES.AI.LATEST, { params: { type } })
}

/**
 * POST /ai/financial-health — LangChain + Gemini assessment (24h cache when valid).
 * Returns cached insight when expiresAt is still in the future.
 */
/** Gemini can take 30–90s; use a longer timeout than default API calls. */
const AI_GENERATE_TIMEOUT_MS = 120_000

export function generateFinancialHealth() {
  return apiClient.post(API_ROUTES.AI.FINANCIAL_HEALTH, undefined, {
    timeout: AI_GENERATE_TIMEOUT_MS,
  })
}
