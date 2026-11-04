import React, { useState, useEffect, useCallback } from 'react'
import { materialTransferService, MaterialTransferFilterOptions } from '../services/materialTransferService'
import { MaterialTransfer, MaterialTransferFormData } from '../types'
import { useAuth } from '../hooks/useAuth'
import { MaterialTransferTable } from '../components/tables/MaterialTransferTable'
import { MaterialTransferForm } from '../components/forms/MaterialTransferForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Pagination } from '../components/ui/Pagination'
import { useToast } from '../components/ui/Toast'
import { Truck, Plus } from 'lucide-react'

export const MaterialTransferPage: React.FC = () => {
  const { employee, isAdmin } = useAuth()
  const { success, error } = useToast()

  const [transfers, setTransfers] = useState<MaterialTransfer[]>([])
  const [totalKilometers, setTotalKilometers] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransfer, setEditingTransfer] = useState<MaterialTransfer | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchTransfers = useCallback(async () => {
    if (!employee) return
    setIsLoading(true)

    const options: MaterialTransferFilterOptions = {
      search,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy: 'date',
      sortOrder,
      page: currentPage,
      pageSize,
      employeeId: isAdmin ? undefined : employee.id,
    }

    const [res, totals] = await Promise.all([
      materialTransferService.getTransfers(options),
      materialTransferService.getTotals(options),
    ])

    setTransfers(res.data)
    setTotalCount(res.totalCount)
    setTotalPages(res.totalPages)
    setTotalKilometers(totals.totalKilometers)
    setTotalCost(totals.totalCost)
    setIsLoading(false)
  }, [employee, isAdmin, search, startDate, endDate, sortOrder, currentPage, pageSize])

  useEffect(() => {
    fetchTransfers()
  }, [fetchTransfers])

  const handleOpenAddModal = () => {
    setEditingTransfer(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (item: MaterialTransfer) => {
    setEditingTransfer(item)
    setIsModalOpen(true)
  }

  const handleFormSubmit = async (formData: MaterialTransferFormData) => {
    if (!employee) return
    setIsSubmitting(true)

    try {
      if (editingTransfer) {
        const res = await materialTransferService.updateTransfer(editingTransfer.id, formData)
        if (res.success) {
          success('Material transfer record updated successfully!')
          setIsModalOpen(false)
          fetchTransfers()
        } else {
          error(res.error || 'Failed to update transfer record.')
        }
      } else {
        const res = await materialTransferService.createTransfer(employee.id, formData)
        if (res.success) {
          success('Material transfer recorded successfully!')
          setIsModalOpen(false)
          fetchTransfers()
        } else {
          error(res.error || 'Failed to record material transfer.')
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    const res = await materialTransferService.deleteTransfer(id)
    if (res.success) {
      success('Material transfer record deleted successfully!')
      fetchTransfers()
    } else {
      error(res.error || 'Failed to delete transfer record.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-teal-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Material Transfer
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track material dispatches, site-to-site routes, distances, and freight logistics costs
          </p>
        </div>

        <div>
          <Button variant="primary" onClick={handleOpenAddModal} className="shadow-md shadow-blue-500/20">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Material Transfer
          </Button>
        </div>
      </div>

      {/* Table & Stats */}
      <MaterialTransferTable
        transfers={transfers}
        totalKilometers={totalKilometers}
        totalCost={totalCost}
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

      {/* Modal: Transfer Form */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingTransfer ? 'Edit Material Transfer' : 'Record Material Transfer'}
          description="Log origin, destination, distance, items and freight costs"
          maxWidth="lg"
        >
          <MaterialTransferForm
            initialData={editingTransfer}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
            isLoading={isSubmitting}
          />
        </Modal>
      )}
    </div>
  )
}

