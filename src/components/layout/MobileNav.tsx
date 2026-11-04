import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarCheck2,
  Truck,
  Calendar,
  FileSpreadsheet,
  Users,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export const MobileNav: React.FC = () => {
  const { isAdmin } = useAuth()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 flex items-center justify-around shadow-lg">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition ${
            isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span>Dashboard</span>
      </NavLink>

      {isAdmin && (
        <NavLink
          to="/employees"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition ${
              isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span>Employees</span>
        </NavLink>
      )}

      <NavLink
        to="/activities"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition ${
            isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <CalendarCheck2 className="w-5 h-5 mb-0.5" />
        <span>Activity</span>
      </NavLink>

      <NavLink
        to="/transfers"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition ${
            isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Truck className="w-5 h-5 mb-0.5" />
        <span>Transfer</span>
      </NavLink>

      <NavLink
        to="/calendar"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition ${
            isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Calendar className="w-5 h-5 mb-0.5" />
        <span>Calendar</span>
      </NavLink>

      <NavLink
        to="/reports"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition ${
            isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <FileSpreadsheet className="w-5 h-5 mb-0.5" />
        <span>Reports</span>
      </NavLink>
    </nav>
  )
}

