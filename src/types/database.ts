export type UserRole = 'employee' | 'admin'

export interface Employee {
  id: string
  employee_name: string
  employee_id: string
  email: string
  company_name: string
  designation: string
  location: string
  department: string
  auth_user_id: string | null
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MonthlyActivity {
  id: string
  employee_id: string
  date: string
  activity: string
  ra: string
  from_location: string
  to_location: string
  to_kilometer: number
  site_name: string
  created_at: string
  updated_at: string
  employee?: {
    employee_name: string
    employee_id: string
    company_name: string
    designation: string
    location: string
    department: string
  }
}

export interface MaterialTransfer {
  id: string
  employee_id: string
  date: string
  activity: string
  from_location: string
  to_location: string
  total_kilometer: number
  cost: number
  created_at: string
  updated_at: string
  employee?: {
    employee_name: string
    employee_id: string
    company_name: string
    designation: string
    location: string
    department: string
  }
}

export interface AuthSession {
  user: {
    id: string
    email?: string
  } | null
  employee: Employee | null
  isLoading: boolean
  isAdmin: boolean
}

