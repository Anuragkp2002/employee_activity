import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../services/supabase'
import { authService, LoginResult, RegistrationResult } from '../services/authService'
import { Employee } from '../types'

interface RegistrationInput { email: string; company_name: string; employee_name: string; employee_id: string; designation?: string; location?: string; department?: string; password: string }
interface AuthContextType {
  user: any | null; employee: Employee | null; isLoading: boolean; isAdmin: boolean
  login: (email: string, password: string) => Promise<LoginResult>
  register: (data: RegistrationInput) => Promise<RegistrationResult>
  logout: () => Promise<void>; refreshProfile: () => Promise<void>
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null)
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const refreshProfile = useCallback(async () => {
    const session = await authService.getCurrentSession()
    setUser(session.user); setEmployee(session.employee); setIsLoading(false)
  }, [])
  useEffect(() => {
    void refreshProfile()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') { setUser(null); setEmployee(null); setIsLoading(false) }
      else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        window.setTimeout(() => { void refreshProfile() }, 0)
      }
    })
    return () => subscription.unsubscribe()
  }, [refreshProfile])
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    const result = await authService.loginWithEmail(email, password)
    if (result.success && result.employee) {
      const { data } = await supabase.auth.getUser()
      setUser(data.user); setEmployee(result.employee)
    }
    setIsLoading(false)
    return result
  }
  const register = async (data: RegistrationInput) => {
    setIsLoading(true)
    const result = await authService.register(data)
    if (result.success && result.employee) await refreshProfile()
    setIsLoading(false)
    return result
  }
  const logout = async () => { setIsLoading(true); await authService.logout(); setUser(null); setEmployee(null); setIsLoading(false) }
  return <AuthContext.Provider value={{ user, employee, isLoading, isAdmin: employee?.role === 'admin' && employee.is_active, login, register, logout, refreshProfile }}>{children}</AuthContext.Provider>
}
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
