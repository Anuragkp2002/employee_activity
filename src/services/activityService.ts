import { MonthlyActivity, ActivityFormData } from '../types'
import { PaginatedResult } from './employeeService'
import { supabase } from './supabase'
export interface ActivityFilterOptions {
  employeeId?: string; startDate?: string; endDate?: string; search?: string
  sortBy?: 'date' | 'created_at' | 'to_kilometer'; sortOrder?: 'asc' | 'desc'; page?: number; pageSize?: number
}
const selectWithEmployee = '*, employee:employees(employee_name, employee_id, company_name, designation, location, department)'
export const activityService = {
  async getActivities(options: ActivityFilterOptions = {}): Promise<PaginatedResult<MonthlyActivity>> {
    const page = options.page || 1, pageSize = options.pageSize || 10, from = (page - 1) * pageSize
    let query = supabase.from('monthly_activities').select(selectWithEmployee, { count: 'exact' })
    if (options.employeeId && options.employeeId !== 'all') query = query.eq('employee_id', options.employeeId)
    if (options.startDate) query = query.gte('date', options.startDate)
    if (options.endDate) query = query.lte('date', options.endDate)
    if (options.search?.trim()) { const term = `%${options.search.trim()}%`; query = query.or(`activity.ilike.${term},site_name.ilike.${term},from_location.ilike.${term},to_location.ilike.${term},ra.ilike.${term}`) }
    query = query.order(options.sortBy || 'date', { ascending: options.sortOrder === 'asc' }).range(from, from + pageSize - 1)
    const { data, count, error } = await query
    if (error) { console.error('Activity query failed:', error.message); return { data: [], totalCount: 0, page, pageSize, totalPages: 0 } }
    const totalCount = count || 0
    return { data: (data || []) as MonthlyActivity[], totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) }
  },
  async getActivityById(id: string): Promise<MonthlyActivity | null> {
    const { data, error } = await supabase.from('monthly_activities').select(selectWithEmployee).eq('id', id).maybeSingle()
    if (error) { console.error('Activity query failed:', error.message); return null }
    return data as MonthlyActivity | null
  },
  async createActivity(employeeId: string, form: ActivityFormData): Promise<{ success: boolean; activity?: MonthlyActivity; error?: string }> {
    const { data, error } = await supabase.from('monthly_activities').insert({
      employee_id: employeeId, date: form.date, activity: form.activity.trim(), ra: form.ra.trim(),
      from_location: form.from_location.trim(), to_location: form.to_location.trim(), to_kilometer: Number(form.to_kilometer) || 0, site_name: form.site_name.trim(),
    }).select(selectWithEmployee).single()
    if (error) return { success: false, error: error.message }
    return { success: true, activity: data as MonthlyActivity }
  },
  async updateActivity(id: string, form: Partial<ActivityFormData>): Promise<{ success: boolean; activity?: MonthlyActivity; error?: string }> {
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (form.date !== undefined) updates.date = form.date
    if (form.activity !== undefined) updates.activity = form.activity.trim()
    if (form.ra !== undefined) updates.ra = form.ra.trim()
    if (form.from_location !== undefined) updates.from_location = form.from_location.trim()
    if (form.to_location !== undefined) updates.to_location = form.to_location.trim()
    if (form.to_kilometer !== undefined) updates.to_kilometer = Number(form.to_kilometer) || 0
    if (form.site_name !== undefined) updates.site_name = form.site_name.trim()
    const { data, error } = await supabase.from('monthly_activities').update(updates).eq('id', id).select(selectWithEmployee).single()
    if (error) return { success: false, error: error.message }
    return { success: true, activity: data as MonthlyActivity }
  },
  async deleteActivity(id: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from('monthly_activities').delete().eq('id', id)
    return error ? { success: false, error: error.message } : { success: true }
  },
}
