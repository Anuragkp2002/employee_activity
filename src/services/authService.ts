import { supabase, isSupabaseConfigured } from './supabase'
import { Employee } from '../types'

export interface LoginResult { success: boolean; employee?: Employee; error?: string }
export interface RegistrationResult { success: boolean; employee?: Employee; needsEmailConfirmation?: boolean; error?: string }

async function loadEmployee(userId: string): Promise<Employee | null> {
  const { data, error } = await supabase.from('employees').select('*').eq('auth_user_id', userId).maybeSingle()
  if (error) throw error
  return data as Employee | null
}

export const authService = {
  async loginWithEmail(email: string, password: string): Promise<LoginResult> {
    if (!isSupabaseConfigured) return { success: false, error: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env and restart the dev server.' }
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !password) return { success: false, error: 'Email and password are required.' }
    const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password })
    if (error || !data.user) return { success: false, error: error?.message || 'Invalid email or password.' }
    try {
      const employee = await loadEmployee(data.user.id)
      if (!employee) {
        await supabase.auth.signOut()
        return { success: false, error: 'Your account is not linked to an employee profile. Ask your administrator to check the employees table.' }
      }
      if (!employee.is_active) {
        await supabase.auth.signOut()
        return { success: false, error: 'Your account is deactivated. Contact your administrator.' }
      }
      return { success: true, employee }
    } catch (err) {
      await supabase.auth.signOut()
      return { success: false, error: `Signed in, but could not load your employee profile: ${(err as Error).message}` }
    }
  },

  async getCurrentSession(): Promise<{ user: any | null; employee: Employee | null }> {
    if (!isSupabaseConfigured) return { user: null, employee: null }
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return { user: null, employee: null }
    try {
      const employee = await loadEmployee(session.user.id)
      if (employee && !employee.is_active) {
        await supabase.auth.signOut()
        return { user: null, employee: null }
      }
      return employee ? { user: session.user, employee } : { user: null, employee: null }
    } catch {
      return { user: null, employee: null }
    }
  },

  async register(data: {
    email: string; company_name: string; employee_name: string; employee_id: string; designation?: string; location?: string; department?: string; password: string
  }): Promise<RegistrationResult> {
    if (!isSupabaseConfigured) return { success: false, error: 'Supabase is not configured. Check the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values in .env.' }
    const email = data.email.trim().toLowerCase()
    const employeeId = data.employee_id.trim().toUpperCase()
    if (!email || !data.company_name.trim() || !data.employee_name.trim() || !employeeId || !data.password) return { success: false, error: 'Email, Company Name, employee name, Employee ID, and password are required.' }
    if (data.password.length < 6) return { success: false, error: 'Password must be at least 6 characters long.' }
    const { data: result, error } = await supabase.auth.signUp({
      email, password: data.password,
      options: { data: {
        employee_name: data.employee_name.trim(), employee_id: employeeId, company_name: data.company_name.trim(),
        designation: data.designation?.trim() || 'Employee',
        location: data.location?.trim() || 'Headquarters',
        department: data.department?.trim() || 'General',
      } },
    })
    if (error) return { success: false, error: error.message }
    if (!result.user) return { success: false, error: 'Supabase did not return a new user.' }
    if (!result.session) return { success: true, needsEmailConfirmation: true }
    try {
      const employee = await loadEmployee(result.user.id)
      if (!employee) return { success: false, error: 'Your account was created, but the employee profile trigger is missing. Apply the project database migration.' }
      return { success: true, employee }
    } catch (err) {
      return { success: false, error: `Account created, but employee profile could not be loaded: ${(err as Error).message}` }
    }
  },

  async logout(): Promise<void> { await supabase.auth.signOut() },
}
