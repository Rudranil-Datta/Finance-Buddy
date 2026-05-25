import axios from 'axios'
import axiosRetry from 'axios-retry'
import { getToken, clearAuthSession } from '@/utils/storage.js'
import { HTTP_STATUS } from '@/utils/constants.js'

/**
 * Normalized API error for UI and auth flows.
 */
export class ApiClientError extends Error {
  constructor(message, statusCode = 0, details = null) {
    super(message || 'Something went wrong')
    this.name = 'ApiClientError'
    this.statusCode = statusCode
    this.details = details
    this.isAuthError = statusCode === HTTP_STATUS.UNAUTHORIZED
  }
}

/** Called on 401 after session cleared (Phase 2: redirect to login). */
let onUnauthorized = null

export function setUnauthorizedHandler(handler) {
  onUnauthorized = typeof handler === 'function' ? handler : null
}

function normalizeBaseUrl(url) {
  if (!url) return 'http://localhost:4000/api'
  return url.replace(/\/+$/, '')
}

const axiosInstance = axios.create({
  baseURL: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL),
  timeout: 60_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 2000
  },
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkError(error) ||
      error.code === 'ECONNABORTED'
    )
  },
})
/**
 * Strip undefined/null; serialize Dates for query strings.
 */
export function serializeParams(params = {}) {
  const result = {}
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    if (value instanceof Date) {
      result[key] = value.toISOString()
    } else if (typeof value === 'boolean') {
      result[key] = value ? 'true' : 'false'
    } else {
      result[key] = value
    }
  }
  return result
}

function extractErrorMessage(data, fallback) {
  if (!data) return fallback
  if (typeof data.message === 'string') return data.message
  if (typeof data.error === 'string') return data.error
  return fallback
}

function handleResponse(response) {
  const { data, config } = response

  if (config?.responseType === 'blob' || data instanceof Blob) {
    return data
  }

  if (data && data.success === false) {
    throw new ApiClientError(
      extractErrorMessage(data, 'Request failed'),
      response.status,
      data,
    )
  }

  if (data && data.success === true && Object.prototype.hasOwnProperty.call(data, 'data')) {
    return data.data
  }

  return data
}

function handleError(error) {
  if (error instanceof ApiClientError) {
    throw error
  }

  if (!axios.isAxiosError(error)) {
    throw new ApiClientError(error?.message || 'Network error', 0, error)
  }

  const { response, message } = error
  const status = response?.status ?? 0
  const payload = response?.data

  if (status === HTTP_STATUS.UNAUTHORIZED) {
    clearAuthSession()
    onUnauthorized?.()
  }

  throw new ApiClientError(
    extractErrorMessage(payload, message || 'Request failed'),
    status,
    payload,
  )
}

axiosInstance.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => {
    try {
      const result = handleResponse(response)
      return { ...response, data: result }
    } catch (err) {
      return Promise.reject(err)
    }
  },
  (error) => Promise.reject(handleError(error)),
)

/**
 * Typed HTTP helpers — all return unwrapped `data` from backend envelope.
 */
export const apiClient = {
  get(url, config = {}) {
    const { params, ...rest } = config
    return axiosInstance
      .get(url, {
        ...rest,
        params: params ? serializeParams(params) : undefined,
      })
      .then((res) => res.data)
  },

  post(url, body, config = {}) {
    const { params, ...rest } = config
    return axiosInstance
      .post(url, body, {
        ...rest,
        params: params ? serializeParams(params) : undefined,
      })
      .then((res) => res.data)
  },

  patch(url, body, config = {}) {
    return axiosInstance.patch(url, body, config).then((res) => res.data)
  },

  delete(url, config = {}) {
    const { params, ...rest } = config
    return axiosInstance
      .delete(url, {
        ...rest,
        params: params ? serializeParams(params) : undefined,
      })
      .then((res) => res.data)
  },

  /**
   * Raw blob download (CSV export). Returns { blob, headers }.
   */
  async getBlob(url, config = {}) {
    const { params, ...rest } = config
    try {
      const response = await axiosInstance.get(url, {
        ...rest,
        params: params ? serializeParams(params) : undefined,
        responseType: 'blob',
      })
      return {
        blob: response.data,
        headers: response.headers,
      }
    } catch (error) {
      throw handleError(error)
    }
  },
}

export default apiClient
