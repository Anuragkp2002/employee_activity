import React, { useState } from 'react'
import { MonthlyActivity } from '../../types'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { formatDate, formatKilometers } from '../../utils/formatters'
import {
  Search,
  Calendar,
  Edit2,
  Trash2,
  ArrowUpDown,
  MapPin,
  Landmark,
  UserCheck,
  CalendarCheck2,
  Plus,
} from 'lucide-react'

export interface ActivityTableProps {
  activities: MonthlyActivity[]
  isLoading: boolean
  onEdit: (activity: MonthlyActivity) => void
  onDelete: (id: string) => Promise<void>
  onAddNew: () => void
  isAdmin?: boolean
  // Filters
  search: string
  onSearchChange: (value: string) => void
  startDate: string
  onStartDateChange: (value: string) => void
  endDate: string
  onEndDateChange: (value: string) => void
  sortOrder: 'asc' | 'desc'
  onToggleSort: () => void
}

export const ActivityTable: React.FC<ActivityTableProps> = ({
  activities,
  isLoading,
  onEdit,
  onDelete,
  onAddNew,
  isAdmin = false,
  search,
  onSearchChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  sortOrder,
  onToggleSort,
}) => {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    await onDelete(deleteId)
    setIsDeleting(false)
    setDeleteId(null)
  }

  return (
    <div className="space-y-4">
      {/* Search & Date Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-1 lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search activity, site, location, RA..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          {/* Start Date */}
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          {/* End Date */}
          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Sort & Quick info */}
        <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Showing {activities.length} records</span>
          </div>

          <button
            onClick={onToggleSort}
            className="flex items-center gap-1.5 hover:text-blue-600 font-medium transition"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort Date ({sortOrder === 'asc' ? 'Oldest First' : 'Newest First'})</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {!isLoading && activities.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <CalendarCheck2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No activity records found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Log your daily activities, travel distances, and reporting notes to keep track of operations.
          </p>
          <div className="mt-5">
            <Button variant="primary" onClick={onAddNew}>
              <Plus className="w-4 h-4 mr-1.5" />
              Add First Activity
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      {activities.length > 0 && (
        <div className="hidden md:block bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  {isAdmin && <th className="py-3 px-4">Employee</th>}
                  <th className="py-3 px-4">Activity Description</th>
                  <th className="py-3 px-4">RA (Reporting Auth)</th>
                  <th className="py-3 px-4">From Location</th>
                  <th className="py-3 px-4">To Location</th>
                  <th className="py-3 px-4">Site Name</th>
                  <th className="py-3 px-4 text-right">To Kilometer</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/70 transition">
                    {/* Date */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {formatDate(act.date, 'dd MMM yyyy')}
                    </td>

                    {/* Employee (for Admin) */}
                    {isAdmin && (
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{act.employee?.employee_name || '-'}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{act.employee?.employee_id}</div>
                      </td>
                    )}

                    {/* Activity */}
                    <td className="py-3.5 px-4 max-w-xs text-slate-700 leading-relaxed">
                      {act.activity}
                    </td>

                    {/* RA */}
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-medium text-slate-800">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        {act.ra}
                      </span>
                    </td>

                    {/* From */}
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {act.from_location}
                      </span>
                    </td>

                    {/* To */}
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        {act.to_location}
                      </span>
                    </td>

                    {/* Site Name */}
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <Landmark className="w-3.5 h-3.5 text-emerald-600" />
                        {act.site_name}
                      </span>
                    </td>

                    {/* To Kilometer */}
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 whitespace-nowrap">
                      {formatKilometers(act.to_kilometer)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(act)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Activity"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(act.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Activity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile Card Layout */}
      {activities.length > 0 && (
        <div className="md:hidden space-y-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {formatDate(act.date, 'dd MMM yyyy')}
                  </span>
                  {isAdmin && act.employee && (
                    <div className="text-xs font-semibold text-slate-900 mt-1.5">
                      {act.employee.employee_name} ({act.employee.employee_id})
                    </div>
                  )}
                </div>
                <div className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                  {formatKilometers(act.to_kilometer)}
                </div>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                {act.activity}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-1 truncate">
                  <Landmark className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{act.site_name}</span>
                </div>
                <div className="flex items-center gap-1 truncate">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{act.ra}</span>
                </div>
                <div className="flex items-center gap-1 col-span-2 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">From: {act.from_location}</span>
                </div>
                <div className="flex items-center gap-1 col-span-2 truncate">
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">To: {act.to_location}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(act)}
                  className="text-xs py-1 px-3 text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteId(act.id)}
                  className="text-xs py-1 px-3"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <Modal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          title="Delete Activity Record"
          description="Are you sure you want to delete this activity record? This action cannot be undone."
          maxWidth="sm"
        >
          <div className="flex items-center justify-end gap-2.5 pt-3">
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteConfirm} isLoading={isDeleting}>
              Delete Record
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

