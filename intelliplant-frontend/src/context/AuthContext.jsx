import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get('/user/profile')
      setUser(res.data.user)
      return res.data.user
    } catch (err) {
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    fetchProfile().finally(() => setLoading(false))
  }, [fetchProfile])

  const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials)
    await fetchProfile()
    return res.data
  }

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload)
    return res.data
  }

  const verifyEmail = async (payload) => {
    const res = await api.post('/auth/verify-email', payload)
    return res.data
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      // ignore — clear client state regardless
    }
    setUser(null)
  }

  const value = { user, setUser, loading, login, register, verifyEmail, logout, refreshProfile: fetchProfile }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
