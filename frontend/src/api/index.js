/**
 * API layer barrel — import services from here in features/pages.
 *
 * @example
 * import { authApi, transactionsApi, ApiClientError } from '@/api'
 */

export {
  default as apiClient,
  ApiClientError,
  setUnauthorizedHandler,
  serializeParams,
} from './client.js'

export * as authApi from './authApi.js'
export * as analyticsApi from './analyticsApi.js'
export * as transactionsApi from './transactionsApi.js'
export * as categoriesApi from './categoriesApi.js'
export * as budgetsApi from './budgetsApi.js'
export * as goalsApi from './goalsApi.js'
export * as notificationsApi from './notificationsApi.js'
export * as reportsApi from './reportsApi.js'
export * as importApi from './importApi.js'
export * as aiApi from './aiApi.js'
