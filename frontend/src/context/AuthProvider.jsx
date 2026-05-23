import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { authApi } from '@/api'
import {
  clearAuthSession,
  getToken,
  getUser as getStoredUser,
  hasToken,
  setUser as setStoredUser,
} from '@/utils/storage.js'
import { AuthContext } from './authContext.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState(null)

  const isAuthenticated = Boolean(user && hasToken())

  const clearError = useCallback(() => setError(null), [])

  const applySession = useCallback((sessionUser) => {
    setUser(sessionUser ?? null)
    if (sessionUser) {
      setStoredUser(sessionUser)
    }
  }, [])

  const refreshUser = useCallback(async () => {
    if (!hasToken()) {
      setUser(null)
      return null
    }

    const profile = await authApi.getMe()
    applySession(profile)
    return profile
  }, [applySession])

  useEffect(() => {
    let cancelled = false

    async function initializeAuth() {
      if (!hasToken()) {
        if (!cancelled) {
          setUser(null)
          setIsReady(true)
        }
        return
      }

      const cachedUser = getStoredUser()
      if (cachedUser && !cancelled) {
        setUser(cachedUser)
      }

      try {
        const profile = await authApi.getMe()
        if (!cancelled) {
          applySession(profile)
        }
      } catch {
        if (!cancelled) {
          clearAuthSession()
          setUser(null)
        }
      } finally {
        if (!cancelled) {
          setIsReady(true)
        }
      }
    }

    initializeAuth()
    return () => {
      cancelled = true
    }
  }, [applySession])

  const login = useCallback(
    async (credentials) => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await authApi.login(credentials)
        applySession(data.user)
        return data
      } catch (err) {
        const message = err?.message || 'Login failed'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [applySession],
  )

  const register = useCallback(
    async (payload) => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await authApi.register(payload)
        applySession(data.user)
        return data
      } catch (err) {
        const message = err?.message || 'Registration failed'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [applySession],
  )

  const logout = useCallback(() => {
    authApi.logout()
    setUser(null)
    setError(null)
    setIsLoading(false)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      isReady,
      error,
      login,
      register,
      logout,
      refreshUser,
      clearError,
      getToken,
    }),
    [
      user,
      isAuthenticated,
      isLoading,
      isReady,
      error,
      login,
      register,
      logout,
      refreshUser,
      clearError,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
