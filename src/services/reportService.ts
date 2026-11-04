import { MonthlyActivity, MaterialTransfer, ReportFilterOptions } from '../types'
import { exportMonthlyActivitiesToExcel, exportMaterialTransfersToExcel, exportCombinedReportToExcel } from './excelExportService'
import { supabase } from './supabase'
function dateBounds(filters: ReportFilterOptions) {
  if (filters.dateFilterType !== 'month') return { start: filters.startDate, end: filters.endDate }
  const month = String(filters.month).padStart(2, '0')
  const last = new Date(filters.year, filters.month, 0).getDate()
  return { start: `${filters.year}-${month}-01`, end: `${filters.year}-${month}-${String(last).padStart(2, '0')}` }
}
function applyReportFilters(query: any, filters: ReportFilterOptions) {
  if (filters.employeeId && filters.employeeId !== 'all') query = query.eq('employee_id', filters.employeeId)
  const { start, end } = dateBounds(filters)
  if (start) query = query.gte('date', start)
  if (end) query = query.lte('date', end)
  return query.order('date', { ascending: true })
}
const selection = '*, employee:employees(employee_name, employee_id, company_name, designation, location, department)'
export const reportService = {
  async getReportActivities(filters: ReportFilterOptions): Promise<MonthlyActivity[]> {
    const { data, error } = await applyReportFilters(supabase.from('monthly_activities').select(selection), filters)
    if (error) { console.error('Activity report query failed:', error.message); return [] }
    return (data || []) as MonthlyActivity[]
  },
  async getReportMaterialTransfers(filters: ReportFilterOptions): Promise<MaterialTransfer[]> {
    const { data, error } = await applyReportFilters(supabase.from('material_transfers').select(selection), filters)
    if (error) { console.error('Transfer report query failed:', error.message); return [] }
    return (data || []) as MaterialTransfer[]
  },
  async exportReport(filters: ReportFilterOptions, metadata: { isAdmin: boolean; employeeName?: string; employeeIdCode?: string; companyName?: string }): Promise<{ success: boolean; recordCount: number; error?: string }> {
    try {
      const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const period = filters.dateFilterType === 'month' ? `${names[filters.month - 1]}_${filters.year}` : `${filters.startDate}_to_${filters.endDate}`
      const employee = metadata.isAdmin && filters.employeeId === 'all' ? 'All_Employees' : metadata.employeeIdCode || 'Employee'
      const activities = filters.reportType === 'material' ? [] : await this.getReportActivities(filters)
      const transfers = filters.reportType === 'activity' ? [] : await this.getReportMaterialTransfers(filters)
      const count = activities.length + transfers.length
      if (!count) return { success: false, recordCount: 0, error: 'No records found matching the selected filters.' }
      const options = { filename: `${filters.reportType}_Report_${employee}_${period}.xlsx`, isAdmin: metadata.isAdmin && filters.employeeId === 'all', companyName: metadata.companyName }
      if (filters.reportType === 'activity') await exportMonthlyActivitiesToExcel(activities, options)
      else if (filters.reportType === 'material') await exportMaterialTransfersToExcel(transfers, options)
      else await exportCombinedReportToExcel(activities, transfers, options)
      return { success: true, recordCount: count }
    } catch (err) { return { success: false, recordCount: 0, error: (err as Error).message } }
  },
}
