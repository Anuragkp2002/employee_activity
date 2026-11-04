import React, { useState } from 'react'
import { MaterialTransfer } from '../../types'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { formatDate, formatKilometers, formatCurrency } from '../../utils/formatters'
import {
  Search,
  Truck,
  Edit2,
  Trash2,
  ArrowUpDown,
  MapPin,
  Plus,
  ArrowRight,
  IndianRupee,
  Gauge,
} from 'lucide-react'

export interface MaterialTransferTableProps {
  transfers: MaterialTransfer[]
  totalKilometers: number
  totalCost: number
  isLoading: boolean
  onEdit: (transfer: MaterialTransfer) => void
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

export const MaterialTransferTable: React.FC<MaterialTransferTableProps> = ({
  transfers,
  totalKilometers,
  totalCost,
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
      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200/80 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider block">
              Total Distance Transferred
            </span>
            <div className="text-2xl font-black text-blue-900 mt-1">
              {formatKilometers(totalKilometers)}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Gauge className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200/80 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-900 uppercase tracking-wider block">
              Total Logistics & Transfer Cost
            </span>
            <div className="text-2xl font-black text-emerald-900 mt-1">
              {formatCurrency(totalCost)}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div className="relative sm:col-span-1 lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search activity, origin, or destination..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
          <span>{transfers.length} records matching criteria</span>

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
      {!isLoading && transfers.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4">
            <Truck className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No material transfers recorded yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Log dispatch details, origin, destination sites, kilometers, and transportation expenses.
          </p>
          <div className="mt-5">
            <Button variant="primary" onClick={onAddNew}>
              <Plus className="w-4 h-4 mr-1.5" />
              Add Material Transfer
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      {transfers.length > 0 && (
        <div className="hidden md:block bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  {isAdmin && <th className="py-3 px-4">Employee</th>}
                  <th className="py-3 px-4">Material / Activity Details</th>
                  <th className="py-3 px-4">Route (From → To)</th>
                  <th className="py-3 px-4 text-right">Distance</th>
                  <th className="py-3 px-4 text-right">Cost</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transfers.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {formatDate(item.date, 'dd MMM yyyy')}
                    </td>

                    {isAdmin && (
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{item.employee?.employee_name || '-'}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{item.employee?.employee_id}</div>
                      </td>
                    )}

                    <td className="py-3.5 px-4 max-w-xs text-slate-700 leading-relaxed">
                      {item.activity}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      {item.from_location || item.to_location ? <div className="flex items-center gap-1.5 font-medium">
                        <span className="text-slate-900">{item.from_location}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-900">{item.to_location}</span>
                      </div> : <span className="text-slate-400">Expense only</span>}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 whitespace-nowrap">
                      {Number(item.total_kilometer) > 0 ? formatKilometers(item.total_kilometer) : '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 whitespace-nowrap">
                      {formatCurrency(item.cost)}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Transfer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Transfer"
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
      {transfers.length > 0 && (
        <div className="md:hidden space-y-3">
          {transfers.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {formatDate(item.date, 'dd MMM yyyy')}
                  </span>
                  {isAdmin && item.employee && (
                    <div className="text-xs font-semibold text-slate-900 mt-1.5">
                      {item.employee.employee_name} ({item.employee.employee_id})
                    </div>
                  )}
                </div>
                <div className="font-mono font-bold text-sm text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                  {formatCurrency(item.cost)}
                </div>
              </div>

              {(item.from_location || item.to_location) && <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{item.from_location}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{item.to_location}</span>
              </div>}

              <div className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                {item.activity}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <span>Distance:</span>
                <span className="font-mono font-bold text-slate-900">{Number(item.total_kilometer) > 0 ? formatKilometers(item.total_kilometer) : '—'}</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(item)}
                  className="text-xs py-1 px-3 text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteId(item.id)}
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
          title="Delete Material Transfer"
          description="Are you sure you want to delete this transfer entry? This action cannot be undone."
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

