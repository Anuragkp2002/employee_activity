import ExcelJS from 'exceljs'
import { MonthlyActivity, MaterialTransfer } from '../types'

export interface ExcelExportOptions {
  filename?: string
  title?: string
  isAdmin?: boolean
  dateRangeLabel?: string
  employeeLabel?: string
  companyName?: string
}

type EmployeeDetails = {
  company_name?: string
  employee_id?: string
  employee_name?: string
  designation?: string
  location?: string
  department?: string
}
type ReportRecord = { employee?: EmployeeDetails }
type ColumnDefinition = { header: string; key: string; width: number }

const employeeColumns: ColumnDefinition[] = [
  { header: 'company_name', key: 'company_name', width: 24 },
  { header: 'employee_id', key: 'employee_id_display', width: 18 },
  { header: 'employee_name', key: 'employee_name', width: 24 },
  { header: 'designation', key: 'designation', width: 22 },
  { header: 'location', key: 'location', width: 22 },
  { header: 'department', key: 'department', width: 20 },
]

const activityColumns: ColumnDefinition[] = [
  ...employeeColumns,
  { header: 'date', key: 'date', width: 14 },
  { header: 'activity', key: 'activity', width: 38 },
  { header: 'ra', key: 'ra', width: 20 },
  { header: 'from_location', key: 'from_location', width: 22 },
  { header: 'to_location', key: 'to_location', width: 22 },
  { header: 'to_kilometer', key: 'to_kilometer', width: 16 },
  { header: 'site_name', key: 'site_name', width: 24 },
]

const transferColumns: ColumnDefinition[] = [
  ...employeeColumns,
  { header: 'date', key: 'date', width: 14 },
  { header: 'activity', key: 'activity', width: 38 },
  { header: 'from_location', key: 'from_location', width: 22 },
  { header: 'to_location', key: 'to_location', width: 22 },
  { header: 'total_kilometer', key: 'total_kilometer', width: 18 },
  { header: 'cost', key: 'cost', width: 18 },
]

function resolvedCompanyName(records: ReportRecord[], fallback?: string) {
  const names = [...new Set(records.map((record) => record.employee?.company_name?.trim()).filter(Boolean))]
  return names.length ? names.join(' / ') : fallback?.trim() || 'Company Name'
}

function prepareWorksheet(
  worksheet: ExcelJS.Worksheet,
  columns: ColumnDefinition[],
  records: ReportRecord[],
  options: ExcelExportOptions,
  color: string,
) {
  worksheet.views = [{ state: 'frozen', ySplit: 2 }]
  worksheet.columns = columns.map(({ key, width }) => ({ key, width }))
  worksheet.mergeCells(1, 1, 1, columns.length)
  const companyCell = worksheet.getCell(1, 1)
  companyCell.value = `Company Name: ${resolvedCompanyName(records, options.companyName)}`
  companyCell.font = { bold: true, size: 16, color: { argb: 'FF0F172A' } }
  companyCell.alignment = { vertical: 'middle', horizontal: 'center' }
  companyCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } }
  worksheet.getRow(1).height = 32

  const header = worksheet.getRow(2)
  header.height = 25
  columns.forEach((column, index) => {
    const cell = header.getCell(index + 1)
    cell.value = column.header
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF94A3B8' } },
      left: { style: 'thin', color: { argb: 'FF94A3B8' } },
      bottom: { style: 'medium', color: { argb: color } },
      right: { style: 'thin', color: { argb: 'FF94A3B8' } },
    }
  })
}

function employeeValues(employee?: EmployeeDetails) {
  return {
    company_name: employee?.company_name || '',
    employee_id_display: employee?.employee_id || '',
    employee_name: employee?.employee_name || '',
    designation: employee?.designation || '',
    location: employee?.location || '',
    department: employee?.department || '',
  }
}

function styleDataRow(row: ExcelJS.Row, index: number) {
  row.height = 21
  row.eachCell((cell) => {
    cell.alignment = { vertical: 'middle', wrapText: true }
    if (index % 2 === 0) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } }
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
    }
  })
}

function addActivityRows(worksheet: ExcelJS.Worksheet, activities: MonthlyActivity[]) {
  activities.forEach((item, index) => {
    const row = worksheet.addRow({
      ...employeeValues(item.employee), date: item.date, activity: item.activity, ra: item.ra,
      from_location: item.from_location, to_location: item.to_location,
      to_kilometer: Number(item.to_kilometer) || 0, site_name: item.site_name,
    })
    styleDataRow(row, index)
    const kmCell = row.getCell('to_kilometer')
    kmCell.numFmt = '#,##0.00'
    kmCell.alignment = { vertical: 'middle', horizontal: 'right' }
  })
}

function addActivityTotals(worksheet: ExcelJS.Worksheet, activities: MonthlyActivity[]) {
  const totalKm = activities.reduce((sum, item) => sum + (Number(item.to_kilometer) || 0), 0)
  const kmColumn = worksheet.getColumn('to_kilometer').letter
  const firstDataRow = 3
  const lastDataRow = activities.length + 2
  worksheet.addRow([])
  const totalRow = worksheet.addRow([])
  totalRow.getCell(1).value = 'Total Kilometer'
  totalRow.getCell('to_kilometer').value = {
    formula: activities.length ? `SUM(${kmColumn}${firstDataRow}:${kmColumn}${lastDataRow})` : '0',
    result: totalKm,
  }
  const excessKm = Math.max(totalKm - 1500, 0)
  const excessRow = worksheet.addRow([])
  excessRow.getCell(1).value = 'Kilometer Above 1,500'
  excessRow.getCell('to_kilometer').value = {
    formula: `MAX(0,${kmColumn}${totalRow.number}-1500)`,
    result: excessKm,
  }
  const allowanceRow = worksheet.addRow([])
  allowanceRow.getCell(1).value = 'Allowance @ 4 per Excess Kilometer'
  allowanceRow.getCell('to_kilometer').value = {
    formula: `MAX(0,${kmColumn}${totalRow.number}-1500)*4`,
    result: excessKm * 4,
  }
  for (const row of [totalRow, excessRow, allowanceRow]) {
    row.font = { bold: true }
    row.getCell('to_kilometer').numFmt = row === allowanceRow ? '₹#,##0.00' : '#,##0.00'
  }
  worksheet.workbook.calcProperties.fullCalcOnLoad = true
}

function addTransferRows(worksheet: ExcelJS.Worksheet, transfers: MaterialTransfer[]) {
  transfers.forEach((item, index) => {
    const row = worksheet.addRow({
      ...employeeValues(item.employee), date: item.date, activity: item.activity,
      from_location: item.from_location, to_location: item.to_location,
      total_kilometer: Number(item.total_kilometer) || 0, cost: Number(item.cost) || 0,
    })
    styleDataRow(row, index)
    row.getCell('total_kilometer').numFmt = '#,##0.00'
    row.getCell('total_kilometer').alignment = { vertical: 'middle', horizontal: 'right' }
    row.getCell('cost').numFmt = '₹#,##0.00'
    row.getCell('cost').alignment = { vertical: 'middle', horizontal: 'right' }
  })
  const totalKm = transfers.reduce((sum, item) => sum + (Number(item.total_kilometer) || 0), 0)
  worksheet.addRow([])
  const totalRow = worksheet.addRow([])
  totalRow.getCell(1).value = 'Total Kilometer'
  totalRow.getCell('total_kilometer').value = totalKm
  totalRow.getCell('total_kilometer').numFmt = '#,##0.00'
  totalRow.font = { bold: true }
}

export async function exportMonthlyActivitiesToExcel(activities: MonthlyActivity[], options: ExcelExportOptions = {}): Promise<void> {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Employee Activity Tracking System'
  workbook.created = new Date()
  const worksheet = workbook.addWorksheet('Monthly Activity & TA')
  prepareWorksheet(worksheet, activityColumns, activities, options, 'FF1E40AF')
  addActivityRows(worksheet, activities)
  addActivityTotals(worksheet, activities)
  await triggerDownload(workbook, options.filename || `Monthly_Activity_Report_${Date.now()}.xlsx`)
}

export async function exportMaterialTransfersToExcel(transfers: MaterialTransfer[], options: ExcelExportOptions = {}): Promise<void> {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Employee Activity Tracking System'
  workbook.created = new Date()
  const worksheet = workbook.addWorksheet('Material Transfer')
  prepareWorksheet(worksheet, transferColumns, transfers, options, 'FF0D9488')
  addTransferRows(worksheet, transfers)
  await triggerDownload(workbook, options.filename || `Material_Transfer_Report_${Date.now()}.xlsx`)
}

export async function exportCombinedReportToExcel(
  activities: MonthlyActivity[],
  transfers: MaterialTransfer[],
  options: ExcelExportOptions = {},
): Promise<void> {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Employee Activity Tracking System'
  workbook.created = new Date()
  const activitySheet = workbook.addWorksheet('Monthly Activity & TA')
  prepareWorksheet(activitySheet, activityColumns, activities, options, 'FF1E40AF')
  addActivityRows(activitySheet, activities)
  addActivityTotals(activitySheet, activities)
  const transferSheet = workbook.addWorksheet('Material Transfer')
  prepareWorksheet(transferSheet, transferColumns, transfers, options, 'FF0D9488')
  addTransferRows(transferSheet, transfers)
  await triggerDownload(workbook, options.filename || `Combined_Tracking_Report_${Date.now()}.xlsx`)
}

async function triggerDownload(workbook: ExcelJS.Workbook, filename: string): Promise<void> {
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  window.URL.revokeObjectURL(url)
}
