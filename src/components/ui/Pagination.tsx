import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  if (totalCount === 0) return null

  const startRecord = (currentPage - 1) * pageSize + 1
  const endRecord = Math.min(currentPage * pageSize, totalCount)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 sm:px-6 bg-white border-t border-slate-200/80">
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-900">{startRecord}</span> to{' '}
          <span className="font-semibold text-slate-900">{endRecord}</span> of{' '}
          <span className="font-semibold text-slate-900">{totalCount}</span> entries
        </div>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="text-xs rounded border border-slate-300 py-1 px-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="text-xs px-2.5 py-1.5"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <div className="text-xs font-medium text-slate-700 px-3">
          Page {currentPage} of {Math.max(1, totalPages)}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="text-xs px-2.5 py-1.5"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

