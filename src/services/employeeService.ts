import { Employee, EmployeeFormData } from '../types'
import { supabase } from './supabase'

export interface EmployeeFilterOptions {
  search?: string; department?: string; location?: string; designation?: string
  sortBy?: 'employee_name' | 'employee_id' | 'created_at'; sortOrder?: 'asc' | 'desc'; page?: number; pageSize?: number
}
export interface PaginatedResult<T> { data: T[]; totalCount: number; page: number; pageSize: number; totalPages: number }
export const employeeService = {
  async registerEmployee(data: EmployeeFormData): Promise<{ success: boolean; employee?: Employee; error?: string }> {
    const { data: result, error } = await supabase.functions.invoke('create-employee', {
      body: {
        employee_name: data.employee_name.trim(), employee_id: data.employee_id.trim().toUpperCase(),
        email: data.email.trim().toLowerCase(), company_name: data.company_name.trim(), designation: data.designation.trim(),
        location: data.location.trim(), department: data.department.trim(), password: data.password,
        role: data.role || 'employee',
      },
    })
    if (error) return { success: false, error: error.message }
    if (result?.error) return { success: false, error: result.error }
    return { success: true, employee: result?.employee as Employee }
  },
  async getEmployees(options: EmployeeFilterOptions = {}): Promise<PaginatedResult<Employee>> {
    const page = options.page || 1, pageSize = options.pageSize || 10
    const from = (page - 1) * pageSize
    let query = supabase.from('employees').select('*', { count: 'exact' })
    if (options.search?.trim()) {
      const term = `%${options.search.trim()}%`
      query = query.or(`employee_name.ilike.${term},employee_id.ilike.${term},email.ilike.${term},company_name.ilike.${term}`)
    }
    if (options.department && options.department !== 'all') query = query.eq('department', options.department)
    if (options.location && options.location !== 'all') query = query.eq('location', options.location)
    if (options.designation && options.designation !== 'all') query = query.eq('designation', options.designation)
    query = query.order(options.sortBy || 'employee_name', { ascending: options.sortOrder !== 'desc' }).range(from, from + pageSize - 1)
    const { data, count, error } = await query
    if (error) { console.error('Employee query failed:', error.message); return { data: [], totalCount: 0, page, pageSize, totalPages: 0 } }
    const totalCount = count || 0
    return { data: (data || []) as Employee[], totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) }
  },
  async getEmployeeById(id: string): Promise<Employee | null> {
    const { data, error } = await supabase.from('employees').select('*').eq('id', id).maybeSingle()
    if (error) { console.error('Employee query failed:', error.message); return null }
    return data as Employee | null
  },
  async updateEmployee(id: string, updates: Partial<Pick<Employee, 'employee_name' | 'company_name' | 'designation' | 'location' | 'department' | 'role'>>): Promise<{ success: boolean; employee?: Employee; error?: string }> {
    const { data, error } = await supabase.from('employees').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) return { success: false, error: error.message }
    return { success: true, employee: data as Employee }
  },
  async toggleActiveStatus(id: string, isActive: boolean): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from('employees').update({ is_active: isActive, updated_at: new Date().toISOString() }).eq('id', id)
    return error ? { success: false, error: error.message } : { success: true }
  },
  async getFilterOptions(): Promise<{ departments: string[]; locations: string[]; designations: string[] }> {
    const { data, error } = await supabase.from('employees').select('department, location, designation')
    if (error || !data) return { departments: [], locations: [], designations: [] }
    return {
      departments: [...new Set(data.map((row) => row.department).filter(Boolean))].sort(),
      locations: [...new Set(data.map((row) => row.location).filter(Boolean))].sort(),
      designations: [...new Set(data.map((row) => row.designation).filter(Boolean))].sort(),
    }
  },
}
