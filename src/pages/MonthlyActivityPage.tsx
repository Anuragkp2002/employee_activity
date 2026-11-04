import React, { useState, useEffect, useCallback } from 'react'
import { activityService, ActivityFilterOptions } from '../services/activityService'
import { MonthlyActivity, ActivityFormData } from '../types'
import { useAuth } from '../hooks/useAuth'
import { ActivityTable } from '../components/tables/ActivityTable'
import { ActivityForm } from '../components/forms/ActivityForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Pagination } from '../components/ui/Pagination'
import { useToast } from '../components/ui/Toast'
import { CalendarCheck2, Plus } from 'lucide-react'

export const MonthlyActivityPage: React.FC = () => {
  const { employee, isAdmin } = useAuth()
  const { success, error } = useToast()

  const [activities, setActivities] = useState<MonthlyActivity[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isLoading, setIsLoading] = useState(true)

  // Filters & search
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<MonthlyActivity | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchActivities = useCallback(async () => {
    if (!employee) return
    setIsLoading(true)

    const options: ActivityFilterOptions = {
      search,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy: 'date',
      sortOrder,
      page: currentPage,
      pageSize,
      // If not admin, restrict to logged in employee
      employeeId: isAdmin ? undefined : employee.id,
    }

    const res = await activityService.getActivities(options)
    setActivities(res.data)
    setTotalCount(res.totalCount)
    setTotalPages(res.totalPages)
    setIsLoading(false)
  }, [employee, isAdmin, search, startDate, endDate, sortOrder, currentPage, pageSize])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  const handleOpenAddModal = () => {
    setEditingActivity(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (act: MonthlyActivity) => {
    setEditingActivity(act)
    setIsModalOpen(true)
  }

  const handleFormSubmit = async (formData: ActivityFormData) => {
    if (!employee) return
    setIsSubmitting(true)

    try {
      if (editingActivity) {
        const res = await activityService.updateActivity(editingActivity.id, formData)
        if (res.success) {
          success('Activity record updated successfully!')
          setIsModalOpen(false)
          fetchActivities()
        } else {
          error(res.error || 'Failed to update activity record.')
        }
      } else {
        const res = await activityService.createActivity(employee.id, formData)
        if (res.success) {
          success('Activity record added successfully!')
          setIsModalOpen(false)
          fetchActivities()
        } else {
          error(res.error || 'Failed to create activity record.')
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    const res = await activityService.deleteActivity(id)
    if (res.success) {
      success('Activity record deleted successfully!')
      fetchActivities()
    } else {
      error(res.error || 'Failed to delete activity.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck2 className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Monthly Activity & TA
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Log site inspections, work operations, reporting authority notes and travel distances
          </p>
        </div>

        <div>
          <Button variant="primary" onClick={handleOpenAddModal} className="shadow-md shadow-blue-500/20">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Activity
          </Button>
        </div>
      </div>

      {/* Activities Table */}
      <ActivityTable
        activities={activities}
        isLoading={isLoading}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
        onAddNew={handleOpenAddModal}
        isAdmin={isAdmin}
        search={search}
        onSearchChange={(val) => {
          setSearch(val)
          setCurrentPage(1)
        }}
        startDate={startDate}
        onStartDateChange={(val) => {
          setStartDate(val)
          setCurrentPage(1)
        }}
        endDate={endDate}
        onEndDateChange={(val) => {
          setEndDate(val)
          setCurrentPage(1)
        }}
        sortOrder={sortOrder}
        onToggleSort={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
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

      {/* Modal: Activity Form */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingActivity ? 'Edit Monthly Activity & TA' : 'New Monthly Activity & TA'}
          description="Enter task notes, reporting authority, site name, and travel kilometer"
          maxWidth="lg"
        >
          <ActivityForm
            initialData={editingActivity}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
            isLoading={isSubmitting}
          />
        </Modal>
      )}
    </div>
  )
}

