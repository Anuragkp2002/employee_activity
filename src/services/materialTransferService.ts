import { MaterialTransfer, MaterialTransferFormData } from '../types'
import { PaginatedResult } from './employeeService'
import { supabase } from './supabase'
export interface MaterialTransferFilterOptions {
  employeeId?: string; startDate?: string; endDate?: string; search?: string
  sortBy?: 'date' | 'created_at' | 'total_kilometer' | 'cost'; sortOrder?: 'asc' | 'desc'; page?: number; pageSize?: number
}
export interface MaterialTransferTotals { totalKilometers: number; totalCost: number }
const selection = '*, employee:employees(employee_name, employee_id, company_name, designation, location, department)'
function filtered(query: any, options: MaterialTransferFilterOptions) {
  if (options.employeeId && options.employeeId !== 'all') query = query.eq('employee_id', options.employeeId)
  if (options.startDate) query = query.gte('date', options.startDate)
  if (options.endDate) query = query.lte('date', options.endDate)
  if (options.search?.trim()) { const term = `%${options.search.trim()}%`; query = query.or(`activity.ilike.${term},from_location.ilike.${term},to_location.ilike.${term}`) }
  return query
}
export const materialTransferService = {
  async getTransfers(options: MaterialTransferFilterOptions = {}): Promise<PaginatedResult<MaterialTransfer>> {
    const page = options.page || 1, pageSize = options.pageSize || 10
    let query = filtered(supabase.from('material_transfers').select(selection, { count: 'exact' }), options)
    query = query.order(options.sortBy || 'date', { ascending: options.sortOrder === 'asc' }).range((page - 1) * pageSize, page * pageSize - 1)
    const { data, count, error } = await query
    if (error) { console.error('Material transfer query failed:', error.message); return { data: [], totalCount: 0, page, pageSize, totalPages: 0 } }
    const totalCount = count || 0
    return { data: (data || []) as MaterialTransfer[], totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) }
  },
  async getTotals(options: MaterialTransferFilterOptions = {}): Promise<MaterialTransferTotals> {
    const { data, error } = await filtered(supabase.from('material_transfers').select('total_kilometer, cost'), options)
    if (error || !data) return { totalKilometers: 0, totalCost: 0 }
    const rows = data as Array<{ total_kilometer: number | string | null; cost: number | string | null }>
    return rows.reduce((totals, item) => ({ totalKilometers: totals.totalKilometers + Number(item.total_kilometer || 0), totalCost: totals.totalCost + Number(item.cost || 0) }), { totalKilometers: 0, totalCost: 0 })
  },
  async createTransfer(employeeId: string, form: MaterialTransferFormData): Promise<{ success: boolean; transfer?: MaterialTransfer; error?: string }> {
    const { data, error } = await supabase.from('material_transfers').insert({
      employee_id: employeeId, date: form.date, activity: form.activity.trim(), from_location: form.from_location.trim(),
      to_location: form.to_location.trim(), total_kilometer: Number(form.total_kilometer) || 0, cost: Number(form.cost) || 0,
    }).select(selection).single()
    if (error) return { success: false, error: error.message }
    return { success: true, transfer: data as MaterialTransfer }
  },
  async updateTransfer(id: string, form: Partial<MaterialTransferFormData>): Promise<{ success: boolean; transfer?: MaterialTransfer; error?: string }> {
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (form.date !== undefined) updates.date = form.date
    if (form.activity !== undefined) updates.activity = form.activity.trim()
    if (form.from_location !== undefined) updates.from_location = form.from_location.trim()
    if (form.to_location !== undefined) updates.to_location = form.to_location.trim()
    if (form.total_kilometer !== undefined) updates.total_kilometer = Number(form.total_kilometer) || 0
    if (form.cost !== undefined) updates.cost = Number(form.cost) || 0
    const { data, error } = await supabase.from('material_transfers').update(updates).eq('id', id).select(selection).single()
    if (error) return { success: false, error: error.message }
    return { success: true, transfer: data as MaterialTransfer }
  },
  async deleteTransfer(id: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from('material_transfers').delete().eq('id', id)
    return error ? { success: false, error: error.message } : { success: true }
  },
}
