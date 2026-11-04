import React from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarCheck2,
  Truck,
  FileSpreadsheet,
  Calendar,
  UserPlus,
  Users,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export const QuickActions: React.FC<{
  onOpenActivityModal?: () => void
  onOpenTransferModal?: () => void
}> = ({ onOpenActivityModal, onOpenTransferModal }) => {
  const { isAdmin } = useAuth()

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {onOpenActivityModal ? (
          <button
            onClick={onOpenActivityModal}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-blue-200/80 bg-blue-50/50 hover:bg-blue-100/70 text-blue-800 transition text-center group"
          >
            <CalendarCheck2 className="w-5 h-5 mb-1.5 text-blue-600 group-hover:scale-110 transition" />
            <span className="text-xs font-semibold leading-tight">Log Activity</span>
          </button>
        ) : (
          <Link
            to="/activities"
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-blue-200/80 bg-blue-50/50 hover:bg-blue-100/70 text-blue-800 transition text-center group"
          >
            <CalendarCheck2 className="w-5 h-5 mb-1.5 text-blue-600 group-hover:scale-110 transition" />
            <span className="text-xs font-semibold leading-tight">Log Activity</span>
          </Link>
        )}

        {onOpenTransferModal ? (
          <button
            onClick={onOpenTransferModal}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-teal-200/80 bg-teal-50/50 hover:bg-teal-100/70 text-teal-800 transition text-center group"
          >
            <Truck className="w-5 h-5 mb-1.5 text-teal-600 group-hover:scale-110 transition" />
            <span className="text-xs font-semibold leading-tight">Log Transfer</span>
          </button>
        ) : (
          <Link
            to="/transfers"
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-teal-200/80 bg-teal-50/50 hover:bg-teal-100/70 text-teal-800 transition text-center group"
          >
            <Truck className="w-5 h-5 mb-1.5 text-teal-600 group-hover:scale-110 transition" />
            <span className="text-xs font-semibold leading-tight">Log Transfer</span>
          </Link>
        )}

        <Link
          to="/calendar"
          className="flex flex-col items-center justify-center p-3 rounded-xl border border-purple-200/80 bg-purple-50/50 hover:bg-purple-100/70 text-purple-800 transition text-center group"
        >
          <Calendar className="w-5 h-5 mb-1.5 text-purple-600 group-hover:scale-110 transition" />
          <span className="text-xs font-semibold leading-tight">Calendar</span>
        </Link>

        <Link
          to="/reports"
          className="flex flex-col items-center justify-center p-3 rounded-xl border border-emerald-200/80 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-800 transition text-center group"
        >
          <FileSpreadsheet className="w-5 h-5 mb-1.5 text-emerald-600 group-hover:scale-110 transition" />
          <span className="text-xs font-semibold leading-tight">Reports</span>
        </Link>

        {isAdmin && (
          <Link
            to="/employees/register"
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-amber-200/80 bg-amber-50/50 hover:bg-amber-100/70 text-amber-800 transition text-center group"
          >
            <UserPlus className="w-5 h-5 mb-1.5 text-amber-600 group-hover:scale-110 transition" />
            <span className="text-xs font-semibold leading-tight">Add Employee</span>
          </Link>
        )}

        {isAdmin && (
          <Link
            to="/employees"
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 transition text-center group"
          >
            <Users className="w-5 h-5 mb-1.5 text-slate-600 group-hover:scale-110 transition" />
            <span className="text-xs font-semibold leading-tight">Manage Staff</span>
          </Link>
        )}
      </div>
    </div>
  )
}

