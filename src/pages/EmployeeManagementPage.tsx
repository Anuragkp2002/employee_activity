import React, { useState, useEffect, useCallback } from 'react'
import { employeeService, EmployeeFilterOptions } from '../services/employeeService'
import { Employee, EmployeeFormData } from '../types'
import { EmployeeTable } from '../components/tables/EmployeeTable'
import { EmployeeForm } from '../components/forms/EmployeeForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Pagination } from '../components/ui/Pagination'
import { useToast } from '../components/ui/Toast'
import { UserPlus, Users } from 'lucide-react'

export const EmployeeManagementPage: React.FC = () => {
  const { success, error, info } = useToast()

  const [employees, setEmployees] = useState<Employee[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isLoading, setIsLoading] = useState(true)

  // Filters & sorting
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('all')
  const [location, setLocation] = useState('all')
  const [designation, setDesignation] = useState('all')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Filter lists
  const [departmentsList, setDepartmentsList] = useState<string[]>([])
  const [locationsList, setLocationsList] = useState<string[]>([])
  const [designationsList, setDesignationsList] = useState<string[]>([])

  // Registration & Editing Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load filter options
  useEffect(() => {
    employeeService.getFilterOptions().then((opts) => {
      setDepartmentsList(opts.departments)
      setLocationsList(opts.locations)
      setDesignationsList(opts.designations)
    })
  }, [])

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true)
    const options: EmployeeFilterOptions = {
      search,
      department,
      location,
      designation,
      sortBy: 'employee_name',
      sortOrder,
      page: currentPage,
      pageSize,
    }

    const res = await employeeService.getEmployees(options)
    setEmployees(res.data)
    setTotalCount(res.totalCount)
    setTotalPages(res.totalPages)
    setIsLoading(false)
  }, [search, department, location, designation, sortOrder, currentPage, pageSize])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  // Handle open registration modal
  const handleOpenAddModal = () => {
    setEditingEmployee(null)
    setIsModalOpen(true)
  }

  // Handle open edit modal
  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmployee(emp)
    setIsModalOpen(true)
  }

  // Handle form submission (Add or Edit)
  const handleFormSubmit = async (formData: EmployeeFormData) => {
    setIsSubmitting(true)
    try {
      if (editingEmployee) {
        // Edit existing
        const res = await employeeService.updateEmployee(editingEmployee.id, {
          employee_name: formData.employee_name,
          company_name: formData.company_name,
          designation: formData.designation,
          location: formData.location,
          department: formData.department,
          role: formData.role,
        })

        if (res.success) {
          success(`Employee details for "${formData.employee_name}" updated successfully!`)
          setIsModalOpen(false)
          fetchEmployees()
        } else {
          error(res.error || 'Failed to update employee details.')
        }
      } else {
        // Register new employee
        const res = await employeeService.registerEmployee(formData)
        if (res.success) {
          success(`Employee "${formData.employee_name}" registered successfully with ID: ${formData.employee_id}!`)
          setIsModalOpen(false)
          fetchEmployees()
          // Refresh filter dropdowns
          employeeService.getFilterOptions().then((opts) => {
            setDepartmentsList(opts.departments)
            setLocationsList(opts.locations)
            setDesignationsList(opts.designations)
          })
        } else {
          error(res.error || 'Failed to register employee.')
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle active status toggle
  const handleToggleActive = async (emp: Employee) => {
    const newStatus = !emp.is_active
    const res = await employeeService.toggleActiveStatus(emp.id, newStatus)
    if (res.success) {
      if (newStatus) {
        success(`Account for ${emp.employee_name} has been reactivated.`)
      } else {
        info(`Account for ${emp.employee_name} has been deactivated.`)
      }
      fetchEmployees()
    } else {
      error(res.error || 'Failed to update account status.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Employee Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Register and manage employee information
          </p>
        </div>

        <div>
          <Button variant="primary" onClick={handleOpenAddModal} className="shadow-md shadow-blue-500/20">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Employee Management Table */}
      <EmployeeTable
        employees={employees}
        isLoading={isLoading}
        onEdit={handleOpenEditModal}
        onToggleActive={handleToggleActive}
        onRegisterFirst={handleOpenAddModal}
        search={search}
        onSearchChange={(val) => {
          setSearch(val)
          setCurrentPage(1)
        }}
        department={department}
        onDepartmentChange={(val) => {
          setDepartment(val)
          setCurrentPage(1)
        }}
        location={location}
        onLocationChange={(val) => {
          setLocation(val)
          setCurrentPage(1)
        }}
        designation={designation}
        onDesignationChange={(val) => {
          setDesignation(val)
          setCurrentPage(1)
        }}
        sortOrder={sortOrder}
        onToggleSort={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
        departmentsList={departmentsList}
        locationsList={locationsList}
        designationsList={designationsList}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize)
          setCurrentPage(1)
        }}
      />

      {/* Employee Registration & Edit Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingEmployee ? 'Edit Employee Details' : 'Register New Employee'}
          description={
            editingEmployee
              ? 'Update employee designation, department, location or role'
              : 'Enter employee credentials and assign company role'
          }
          maxWidth="lg"
        >
          <EmployeeForm
            initialData={editingEmployee}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
            isLoading={isSubmitting}
          />
        </Modal>
      )}
    </div>
  )
}

