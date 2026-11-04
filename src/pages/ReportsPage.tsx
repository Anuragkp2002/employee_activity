import React, { useState, useEffect, useCallback } from 'react'
import { reportService } from '../services/reportService'
import { employeeService } from '../services/employeeService'
import { MonthlyActivity, MaterialTransfer, ReportFilterOptions, Employee } from '../types'
import { useAuth } from '../hooks/useAuth'
import { formatDate, formatKilometers, formatCurrency } from '../utils/formatters'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { useToast } from '../components/ui/Toast'
import {
  FileSpreadsheet,
  Download,
  Filter,
  Calendar,
  Layers,
  Truck,
  CalendarCheck2,
  Users,
  Eye,
  CheckCircle2,
} from 'lucide-react'

export const ReportsPage: React.FC = () => {
  const { employee, isAdmin } = useAuth()
  const { success, error, info } = useToast()

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1 // 1 - 12

  // Filters State
  const [reportType, setReportType] = useState<'activity' | 'material' | 'combined'>('combined')
  const [dateFilterType, setDateFilterType] = useState<'month' | 'range'>('month')
  const [year, setYear] = useState<number>(currentYear)
  const [month, setMonth] = useState<number>(currentMonth)
  const [startDate, setStartDate] = useState<string>(
    `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`
  )
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('all')

  // Employees list for admin dropdown
  const [employeeList, setEmployeeList] = useState<Employee[]>([])

  // Preview data
  const [previewActivities, setPreviewActivities] = useState<MonthlyActivity[]>([])
  const [previewTransfers, setPreviewTransfers] = useState<MaterialTransfer[]>([])
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Load employee list if admin
  useEffect(() => {
    if (isAdmin) {
      employeeService.getEmployees({ pageSize: 500 }).then((res) => {
        setEmployeeList(res.data)
      })
    }
  }, [isAdmin])

  // Current active filter object
  const getFilterOptions = useCallback((): ReportFilterOptions => {
    return {
      reportType,
      dateFilterType,
      year: Number(year),
      month: Number(month),
      startDate,
      endDate,
      // If employee, enforce employee.id; if admin, use selectedEmployeeId
      employeeId: isAdmin ? selectedEmployeeId : employee?.id || 'all',
    }
  }, [reportType, dateFilterType, year, month, startDate, endDate, selectedEmployeeId, isAdmin, employee])

  // Load preview records
  const loadPreview = useCallback(async () => {
    setIsLoadingPreview(true)
    const filters = getFilterOptions()

    try {
      if (reportType === 'activity' || reportType === 'combined') {
        const actData = await reportService.getReportActivities(filters)
        setPreviewActivities(actData)
      } else {
        setPreviewActivities([])
      }

      if (reportType === 'material' || reportType === 'combined') {
        const transData = await reportService.getReportMaterialTransfers(filters)
        setPreviewTransfers(transData)
      } else {
        setPreviewTransfers([])
      }
    } catch (err) {
      console.error('Failed to load report preview:', err)
    } finally {
      setIsLoadingPreview(false)
    }
  }, [getFilterOptions, reportType])

  useEffect(() => {
    loadPreview()
  }, [loadPreview])

  // Handle Excel Export
  const handleExport = async () => {
    setIsExporting(true)
    const filters = getFilterOptions()

    let employeeIdCode = employee?.employee_id || 'Staff'
    if (isAdmin && selectedEmployeeId !== 'all') {
      const selected = employeeList.find((e) => e.id === selectedEmployeeId)
      if (selected) employeeIdCode = selected.employee_id
    }

    const res = await reportService.exportReport(filters, {
      isAdmin,
      employeeName: employee?.employee_name,
      employeeIdCode,
      companyName: employee?.company_name,
    })

    setIsExporting(false)
    if (res.success) {
      success(`Successfully exported ${res.recordCount} records to Excel!`)
    } else {
      error(res.error || 'Failed to export Excel report.')
    }
  }

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ]

  const years = [currentYear, currentYear - 1, currentYear - 2]

  const totalRecords = previewActivities.length + previewTransfers.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Reports & Excel Export
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate and download formatted company spreadsheets using official database field headers
          </p>
        </div>

        <div>
          <Button
            variant="success"
            onClick={handleExport}
            isLoading={isExporting}
            disabled={totalRecords === 0}
            className="shadow-md shadow-emerald-600/20"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Download Excel Report (.xlsx)
          </Button>
        </div>
      </div>

      {/* Report Filter Controls Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <CardTitle>Report Parameters & Filters</CardTitle>
          </div>
          <Badge variant="secondary" size="sm">
            {totalRecords} records matched
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Report Type */}
            <Select
              label="Report Category"
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
            >
              <option value="combined">Combined Report (2 Worksheets)</option>
              <option value="activity">Monthly Activity & TA Only</option>
              <option value="material">Material Transfer Only</option>
            </Select>

            {/* Date Selection Type */}
            <Select
              label="Time Horizon"
              value={dateFilterType}
              onChange={(e) => setDateFilterType(e.target.value as any)}
            >
              <option value="month">Specific Month & Year</option>
              <option value="range">Custom Date Range</option>
            </Select>

            {/* Conditional Date Inputs */}
            {dateFilterType === 'month' ? (
              <>
                <Select
                  label="Select Month"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                >
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Select Year"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Select>
              </>
            ) : (
              <>
                <Input
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </>
            )}
          </div>

          {/* Employee Selector (Admin Only) */}
          {isAdmin && (
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1 max-w-md">
                <Select
                  label="Filter by Employee (Admin Feature)"
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                >
                  <option value="all">Company-Wide (All Employees)</option>
                  {employeeList.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.employee_name} ({emp.employee_id} - {emp.department})
                    </option>
                  ))}
                </Select>
              </div>

              <div className="text-xs text-slate-500 pt-4 sm:pt-0">
                {selectedEmployeeId === 'all'
                  ? 'Includes employee details columns for administrative audit.'
                  : 'Generating focused individual employee report.'}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Data Preview Section */}
      <div className="space-y-6">
        {/* Activity Preview Table */}
        {(reportType === 'activity' || reportType === 'combined') && (
          <Card>
            <CardHeader className="bg-blue-50/50">
              <div className="flex items-center gap-2">
                <CalendarCheck2 className="w-4 h-4 text-blue-700" />
                <CardTitle className="text-blue-950">
                  Preview: Monthly Activity & TA ({previewActivities.length} rows)
                </CardTitle>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Worksheet: "Monthly Activity & TA"
              </span>
            </CardHeader>
            <CardContent className="p-0">
              {previewActivities.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No activity records match the selected date parameters.
                </div>
              ) : (
                <div className="overflow-x-auto max-h-80 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase font-semibold sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-4">date</th>
                        {isAdmin && <th className="py-2.5 px-4">employee_id</th>}
                        <th className="py-2.5 px-4">activity</th>
                        <th className="py-2.5 px-4">ra</th>
                        <th className="py-2.5 px-4">from_location</th>
                        <th className="py-2.5 px-4">to_location</th>
                        <th className="py-2.5 px-4 text-right">to_kilometer</th>
                        <th className="py-2.5 px-4">site_name</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {previewActivities.map((act) => (
                        <tr key={act.id} className="hover:bg-slate-50">
                          <td className="py-2 px-4 whitespace-nowrap">{act.date}</td>
                          {isAdmin && (
                            <td className="py-2 px-4 whitespace-nowrap text-blue-700">
                              {act.employee?.employee_id || '-'}
                            </td>
                          )}
                          <td className="py-2 px-4 max-w-xs truncate font-sans text-xs">{act.activity}</td>
                          <td className="py-2 px-4 whitespace-nowrap">{act.ra}</td>
                          <td className="py-2 px-4 whitespace-nowrap">{act.from_location}</td>
                          <td className="py-2 px-4 whitespace-nowrap">{act.to_location}</td>
                          <td className="py-2 px-4 text-right whitespace-nowrap font-bold">
                            {formatKilometers(act.to_kilometer)}
                          </td>
                          <td className="py-2 px-4 whitespace-nowrap">{act.site_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Material Transfer Preview Table */}
        {(reportType === 'material' || reportType === 'combined') && (
          <Card>
            <CardHeader className="bg-teal-50/50">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-teal-700" />
                <CardTitle className="text-teal-950">
                  Preview: Material Transfer ({previewTransfers.length} rows)
                </CardTitle>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Worksheet: "Material Transfer"
              </span>
            </CardHeader>
            <CardContent className="p-0">
              {previewTransfers.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No material transfer records match the selected date parameters.
                </div>
              ) : (
                <div className="overflow-x-auto max-h-80 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase font-semibold sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-4">date</th>
                        {isAdmin && <th className="py-2.5 px-4">employee_id</th>}
                        <th className="py-2.5 px-4">activity</th>
                        <th className="py-2.5 px-4">from_location</th>
                        <th className="py-2.5 px-4">to_location</th>
                        <th className="py-2.5 px-4 text-right">total_kilometer</th>
                        <th className="py-2.5 px-4 text-right">cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {previewTransfers.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-2 px-4 whitespace-nowrap">{item.date}</td>
                          {isAdmin && (
                            <td className="py-2 px-4 whitespace-nowrap text-teal-700">
                              {item.employee?.employee_id || '-'}
                            </td>
                          )}
                          <td className="py-2 px-4 max-w-xs truncate font-sans text-xs">{item.activity}</td>
                          <td className="py-2 px-4 whitespace-nowrap">{item.from_location}</td>
                          <td className="py-2 px-4 whitespace-nowrap">{item.to_location}</td>
                          <td className="py-2 px-4 text-right whitespace-nowrap font-bold">
                            {formatKilometers(item.total_kilometer)}
                          </td>
                          <td className="py-2 px-4 text-right whitespace-nowrap font-bold text-emerald-700">
                            {formatCurrency(item.cost)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

