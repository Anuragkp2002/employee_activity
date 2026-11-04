import React, { useState } from 'react'
import { Employee } from '../../types'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import {
  Search,
  Filter,
  Edit2,
  Eye,
  Power,
  ArrowUpDown,
  Building2,
  MapPin,
  Briefcase,
  Hash,
  ShieldCheck,
  UserPlus,
} from 'lucide-react'

export interface EmployeeTableProps {
  employees: Employee[]
  isLoading: boolean
  onEdit: (employee: Employee) => void
  onToggleActive: (employee: Employee) => void
  onRegisterFirst: () => void
  // Filters & search
  search: string
  onSearchChange: (value: string) => void
  department: string
  onDepartmentChange: (value: string) => void
  location: string
  onLocationChange: (value: string) => void
  designation: string
  onDesignationChange: (value: string) => void
  sortOrder: 'asc' | 'desc'
  onToggleSort: () => void
  // Options
  departmentsList: string[]
  locationsList: string[]
  designationsList: string[]
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoading,
  onEdit,
  onToggleActive,
  onRegisterFirst,
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  location,
  onLocationChange,
  designation,
  onDesignationChange,
  sortOrder,
  onToggleSort,
  departmentsList,
  locationsList,
  designationsList,
}) => {
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null)
  const [confirmToggle, setConfirmToggle] = useState<Employee | null>(null)

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search by Name or ID */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or employee ID..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={department}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            >
              <option value="all">All Departments</option>
              {departmentsList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="relative">
            <select
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            >
              <option value="all">All Locations</option>
              {locationsList.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Designation Filter */}
          <div className="relative">
            <select
              value={designation}
              onChange={(e) => onDesignationChange(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            >
              <option value="all">All Designations</option>
              {designationsList.map((des) => (
                <option key={des} value={des}>
                  {des}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters / Sort Row */}
        <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Active filters: {search || department !== 'all' || location !== 'all' || designation !== 'all' ? 'Applied' : 'None'}</span>
          </div>

          <button
            onClick={onToggleSort}
            className="flex items-center gap-1.5 hover:text-blue-600 font-medium transition"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort Name ({sortOrder === 'asc' ? 'A → Z' : 'Z → A'})</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {!isLoading && employees.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No employees registered yet.</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Get started by registering the first team member or adjust your search and filters.
          </p>
          <div className="mt-5">
            <Button variant="primary" onClick={onRegisterFirst}>
              <UserPlus className="w-4 h-4 mr-2" />
              Register First Employee
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      {employees.length > 0 && (
        <div className="hidden md:block bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Employee Details</th>
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition">
                    {/* Employee Name & UUID info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {emp.employee_name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            {emp.employee_name}
                            {emp.role === 'admin' && (
                              <Badge variant="primary" size="sm" className="py-0 px-1 text-[9px]">
                                <ShieldCheck className="w-2.5 h-2.5 mr-0.5" /> Admin
                              </Badge>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono" title={`UUID: ${emp.id}`}>
                            ID: {emp.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Employee ID */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                      {emp.employee_id}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">{emp.company_name}</td>

                    {/* Designation */}
                    <td className="py-3.5 px-4 text-slate-700">{emp.designation}</td>

                    {/* Department */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <Badge variant="secondary" size="sm">
                        {emp.department}
                      </Badge>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-slate-600">{emp.location}</td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {emp.is_active ? (
                        <Badge variant="success" size="sm">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="danger" size="sm">
                          Deactivated
                        </Badge>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewEmployee(emp)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(emp)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Employee"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmToggle(emp)}
                          className={`p-1.5 rounded-lg transition ${
                            emp.is_active
                              ? 'text-rose-600 hover:text-rose-800 hover:bg-rose-50'
                              : 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50'
                          }`}
                          title={emp.is_active ? 'Deactivate Account' : 'Activate Account'}
                        >
                          <Power className="w-4 h-4" />
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
      {employees.length > 0 && (
        <div className="md:hidden space-y-3">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{emp.employee_name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold">
                      {emp.employee_id}
                    </span>
                    {emp.role === 'admin' ? (
                      <Badge variant="primary" size="sm">Admin</Badge>
                    ) : (
                      <Badge variant="secondary" size="sm">Staff</Badge>
                    )}
                  </div>
                </div>
                <div>
                  {emp.is_active ? (
                    <Badge variant="success" size="sm">Active</Badge>
                  ) : (
                    <Badge variant="danger" size="sm">Deactivated</Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5 col-span-2 truncate">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{emp.company_name}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{emp.designation}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{emp.department}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{emp.location}</span>
                </div>
              </div>

              {/* Actions row */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewEmployee(emp)}
                  className="text-xs py-1 px-2.5"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" /> View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(emp)}
                  className="text-xs py-1 px-2.5 text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                </Button>
                <Button
                  variant={emp.is_active ? 'danger' : 'success'}
                  size="sm"
                  onClick={() => setConfirmToggle(emp)}
                  className="text-xs py-1 px-2.5"
                >
                  <Power className="w-3.5 h-3.5 mr-1" />
                  {emp.is_active ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Employee Modal */}
      {viewEmployee && (
        <Modal
          isOpen={!!viewEmployee}
          onClose={() => setViewEmployee(null)}
          title="Employee Profile Details"
          description="Employee details stored in the company database"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center">
                {viewEmployee.employee_name?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">{viewEmployee.employee_name}</h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {viewEmployee.employee_id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg col-span-2">
                <span className="text-slate-400 block uppercase tracking-wider font-semibold text-[10px]">Company Name</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{viewEmployee.company_name}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block uppercase tracking-wider font-semibold text-[10px]">
                  Designation
                </span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                  {viewEmployee.designation}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block uppercase tracking-wider font-semibold text-[10px]">
                  Department
                </span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                  {viewEmployee.department}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block uppercase tracking-wider font-semibold text-[10px]">
                  Location
                </span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                  {viewEmployee.location}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block uppercase tracking-wider font-semibold text-[10px]">
                  Status
                </span>
                <span className="mt-0.5 block">
                  {viewEmployee.is_active ? (
                    <Badge variant="success" size="sm">Active Account</Badge>
                  ) : (
                    <Badge variant="danger" size="sm">Deactivated</Badge>
                  )}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 font-mono text-slate-500">
              <div>UUID (Primary Key): <span className="text-slate-700">{viewEmployee.id}</span></div>
              <div>Role: <span className="text-slate-700">{viewEmployee.role}</span></div>
              <div>Created: <span className="text-slate-700">{new Date(viewEmployee.created_at).toLocaleString()}</span></div>
            </div>

            <div className="pt-3 flex justify-end">
              <Button variant="outline" onClick={() => setViewEmployee(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Dialog before Deactivating/Activating */}
      {confirmToggle && (
        <Modal
          isOpen={!!confirmToggle}
          onClose={() => setConfirmToggle(null)}
          title={confirmToggle.is_active ? 'Deactivate Employee Account?' : 'Activate Employee Account?'}
          description="Confirmation required before altering access credentials"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              {confirmToggle.is_active ? (
                <>
                  Are you sure you want to deactivate account for{' '}
                  <strong className="text-slate-900">{confirmToggle.employee_name}</strong> (
                  {confirmToggle.employee_id})? The employee will be immediately prevented from
                  logging in or submitting activity records.
                </>
              ) : (
                <>
                  Are you sure you want to reactivate account for{' '}
                  <strong className="text-slate-900">{confirmToggle.employee_name}</strong> (
                  {confirmToggle.employee_id})? The employee will be able to log in and use the system again.
                </>
              )}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setConfirmToggle(null)}>
                Cancel
              </Button>
              <Button
                variant={confirmToggle.is_active ? 'danger' : 'success'}
                size="sm"
                onClick={() => {
                  onToggleActive(confirmToggle)
                  setConfirmToggle(null)
                }}
              >
                {confirmToggle.is_active ? 'Yes, Deactivate Account' : 'Yes, Reactivate Account'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

