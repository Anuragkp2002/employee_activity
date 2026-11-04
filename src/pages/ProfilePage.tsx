import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import {
  UserCircle,
  Hash,
  Briefcase,
  Building,
  MapPin,
  ShieldCheck,
  Calendar,
  Lock,
  LogOut,
  CheckCircle2,
} from 'lucide-react'

export const ProfilePage: React.FC = () => {
  const { employee, isAdmin, logout } = useAuth()

  if (!employee) return null

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <UserCircle className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">My Profile</h1>
        </div>
        <p className="text-xs text-slate-500">
          Personal identification, department assignment, and system privileges
        </p>
      </div>

      {/* Main Profile Card */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              {employee.employee_name?.slice(0, 2).toUpperCase()}
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                <h2 className="text-xl font-bold text-slate-900">{employee.employee_name}</h2>
                <div className="flex items-center justify-center gap-1.5">
                  {isAdmin ? (
                    <Badge variant="primary" size="md">
                      <ShieldCheck className="w-3.5 h-3.5 mr-0.5" /> Administrator
                    </Badge>
                  ) : (
                    <Badge variant="secondary" size="md">
                      Employee
                    </Badge>
                  )}
                  {employee.is_active ? (
                    <Badge variant="success" size="md">
                      Active Account
                    </Badge>
                  ) : (
                    <Badge variant="danger" size="md">
                      Deactivated
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-slate-500">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span>Employee ID: <strong className="text-slate-800">{employee.employee_id}</strong></span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Briefcase className="w-3 h-3" /> Designation
              </span>
              <p className="text-sm font-semibold text-slate-800">{employee.designation}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Building className="w-3 h-3" /> Company Name
              </span>
              <p className="text-sm font-semibold text-slate-800">{employee.company_name}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Building className="w-3 h-3" /> Department
              </span>
              <p className="text-sm font-semibold text-slate-800">{employee.department}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Location
              </span>
              <p className="text-sm font-semibold text-slate-800">{employee.location}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Account Registered
              </span>
              <p className="text-sm font-semibold text-slate-800">
                {new Date(employee.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Local account details */}
          <div className="p-4 rounded-xl bg-slate-900 text-slate-300 font-mono text-[11px] space-y-1.5">
            <div className="flex items-center gap-1.5 text-blue-400 font-bold mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Account Identification</span>
            </div>
            <div>UUID Primary Key: <span className="text-white">{employee.id}</span></div>
            <div>Local User ID: <span className="text-white">{employee.id}</span></div>
          </div>

          {/* Logout Action */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <span className="text-xs text-slate-500">Need to switch accounts?</span>
            <Button variant="danger" size="sm" onClick={() => logout()}>
              <LogOut className="w-4 h-4 mr-1.5" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

