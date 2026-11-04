import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CalendarCheck2,
  Truck,
  Calendar,
  FileSpreadsheet,
  UserCircle,
  LogOut,
  ShieldCheck,
  Building2,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Badge } from '../ui/Badge'

interface SidebarProps {
  onCloseMobile?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { employee, isAdmin, logout } = useAuth()

  const navItems = [
    {
      label: 'Dashboard',
      to: '/dashboard',
      icon: LayoutDashboard,
      adminOnly: false,
    },
    {
      label: 'Employee Management',
      to: '/employees',
      icon: Users,
      adminOnly: true,
    },
    {
      label: 'Monthly Activity & TA',
      to: '/activities',
      icon: CalendarCheck2,
      adminOnly: false,
    },
    {
      label: 'Material Transfer',
      to: '/transfers',
      icon: Truck,
      adminOnly: false,
    },
    {
      label: 'Calendar',
      to: '/calendar',
      icon: Calendar,
      adminOnly: false,
    },
    {
      label: 'Reports & Export',
      to: '/reports',
      icon: FileSpreadsheet,
      adminOnly: false,
    },
    {
      label: 'My Profile',
      to: '/profile',
      icon: UserCircle,
      adminOnly: false,
    },
  ]

  const filteredNavItems = navItems.filter((item) => (item.adminOnly ? isAdmin : true))

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col h-full select-none">
      {/* Brand logo & header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 text-sm tracking-tight">ActivityTrack</h1>
          <p className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">Enterprise Suite</p>
        </div>
      </div>

      {/* Employee / Admin Info Card */}
      {employee && (
        <div className="mx-4 my-3 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
            {employee.employee_name?.slice(0, 2).toUpperCase() || 'EM'}
          </div>
          <div className="overflow-hidden flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-slate-900 truncate block">
                {employee.employee_name}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-slate-500 font-mono">{employee.employee_id}</span>
              {isAdmin ? (
                <Badge variant="primary" size="sm" className="text-[10px] py-0 px-1.5">
                  <ShieldCheck className="w-2.5 h-2.5 mr-0.5" /> Admin
                </Badge>
              ) : (
                <Badge variant="secondary" size="sm" className="text-[10px] py-0 px-1.5">
                  Staff
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
          Main Navigation
        </div>
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={() => {
            if (onCloseMobile) onCloseMobile()
            logout()
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}

