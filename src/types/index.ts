import { Employee, MonthlyActivity, MaterialTransfer } from './database'

export type { Employee, MonthlyActivity, MaterialTransfer }

export interface EmployeeFormData {
  employee_name: string
  employee_id: string
  email: string
  company_name: string
  designation: string
  location: string
  department: string
  password?: string
  role?: 'employee' | 'admin'
}

export interface ActivityFormData {
  date: string
  activity: string
  ra: string
  from_location: string
  to_location: string
  to_kilometer: number
  site_name: string
}

export interface MaterialTransferFormData {
  date: string
  activity: string
  from_location: string
  to_location: string
  total_kilometer: number
  cost: number
}

export interface ReportFilterOptions {
  reportType: 'activity' | 'material' | 'combined'
  dateFilterType: 'month' | 'range'
  year: number
  month: number // 1 - 12
  startDate: string
  endDate: string
  employeeId: string // 'all' or specific employee UUID
}

export interface DashboardStats {
  currentMonthName: string
  activityCount: number
  totalKilometers: number
  materialTransferCount: number
  materialTransferTotalCost: number
  recentActivities: MonthlyActivity[]
  recentMaterialTransfers: MaterialTransfer[]
}

