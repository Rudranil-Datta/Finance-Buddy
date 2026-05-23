import apiClient from './client.js'
import { API_ROUTES } from '@/utils/constants.js'

/**
 * Shared date-range params for analytics endpoints.
 * @typedef {{ startDate?: Date | string, endDate?: Date | string }} DateRangeParams
 */

/**
 * GET /analytics/dashboard — KPIs, top categories, monthly expenses, savings goals.
 */
export function getDashboard(params = {}) {
  return apiClient.get(API_ROUTES.ANALYTICS.DASHBOARD, { params })
}

/**
 * GET /analytics/monthly — monthly expense totals by period.
 */
export function getMonthlyExpenses(params = {}) {
  return apiClient.get(API_ROUTES.ANALYTICS.MONTHLY, { params })
}

/**
 * GET /analytics/by-category — category breakdown with percentages.
 */
export function getCategorySpending(params = {}) {
  return apiClient.get(API_ROUTES.ANALYTICS.BY_CATEGORY, { params })
}

/**
 * GET /analytics/income-vs-expense
 */
export function getIncomeVsExpense(params = {}) {
  return apiClient.get(API_ROUTES.ANALYTICS.INCOME_VS_EXPENSE, { params })
}

/**
 * GET /analytics/savings-trends
 */
export function getSavingsTrends() {
  return apiClient.get(API_ROUTES.ANALYTICS.SAVINGS_TRENDS)
}

/**
 * GET /analytics/recent
 * @param {{ limit?: number }} [params]
 */
export function getRecentTransactions(params = {}) {
  return apiClient.get(API_ROUTES.ANALYTICS.RECENT, { params })
}

/**
 * GET /analytics/top-categories
 * @param {{ limit?: number, startDate?: Date | string, endDate?: Date | string }} [params]
 */
export function getTopCategories(params = {}) {
  return apiClient.get(API_ROUTES.ANALYTICS.TOP_CATEGORIES, { params })
}
