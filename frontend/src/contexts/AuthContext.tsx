'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import type { LoginRequest, LoginResponse } from '@/services/authService'
import {
  login as apiLogin,
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  isAuthenticated as checkAuth
} from '@/services/authService'

interface AuthContextType {
  user: LoginResponse['user'] | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (data: LoginRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)

      try {
        const token = getAuthToken()

        if (token) {
          // You might want to validate the token with your backend here
          // or decode it if it's a JWT to get user info
          setIsAuthenticated(true)

          // For now we'll leave the user as null, but in a real app
          // you would fetch the user profile or decode it from the token
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        removeAuthToken()
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (data: LoginRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiLogin(data)

      setAuthToken(response.user.username, response.token, response.user.roles[0])

      setUser(response.user)
      setIsAuthenticated(true)
      // Check for force password change
      const today = new Date().toISOString().slice(0, 10)
      if (
        response.user.forcePasswordChangeOnLogin === 1 ||
        (response.user.passwordExpiryDate && response.user.passwordExpiryDate.slice(0, 10) === today)
      ) {
        router.push(`/reset-password?email=${response.user.username}`)
      } else {
        router.push('/')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    removeAuthToken()
    setUser(null)
    setIsAuthenticated(false)
    router.push('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
