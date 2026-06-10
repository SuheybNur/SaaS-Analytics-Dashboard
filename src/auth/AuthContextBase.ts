import { createContext } from 'react'

type AuthContextType = {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

export const AUTH_KEY = 'saas-dashboard-auth'
export const AuthContext = createContext<AuthContextType | null>(null)
export type { AuthContextType }
