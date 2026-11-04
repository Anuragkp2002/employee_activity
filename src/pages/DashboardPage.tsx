import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { employeeService } from '../services/employeeService'
import { activityService } from '../services/activityService'
import { materialTransferService } from '../services/materialTransferService'
import { MonthlyActivity, MaterialTransfer } from '../types'
import { formatKilometers, formatCurrency, formatDate } from '../utils/formatters'
import { StatCard } from '../components/dashboard/StatCard'
import { QuickActions } from '../components/dashboard/QuickActions'
import { RecentActivitiesList } from '../components/dashboard/RecentActivitiesList'
import { RecentMaterialTransfersList } from '../components/dashboard/RecentMaterialTransfersList'
import { ActivityForm } from '../components/forms/ActivityForm'
import { MaterialTransferForm } from '../components/forms/MaterialTransferForm'
import { Modal } from '../components/ui/Modal'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { useToast } from '../components/ui/Toast'
import {
  CalendarCheck2,
  Gauge,
  Truck,
  IndianRupee,
  Users,
  ShieldCheck,
  Building2,
  MapPin,
  Briefcase,
  Calendar as CalendarIcon,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const { employee, isAdmin } = useAuth()
  const { success, error } = useToast()

  const [isLoading, setIsLoading] = useState(true)

  // Current month bounds
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonthNumber = now.getMonth() + 1
  const currentMonthName = now.toLocaleString('default', { month: 'long', year: 'numeric' })
  const startOfMonth = `${currentYear}-${String(currentMonthNumber).padStart(2, '0')}-01`
  const lastDay = new Date(currentYear, currentMonthNumber, 0).getDate()
  const endOfMonth = `${currentYear}-${String(currentMonthNumber).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  // Stats state
  const [activityCount, setActivityCount] = useState(0)
  const [totalKm, setTotalKm] = useState(0)
  const [transferCount, setTransferCount] = useState(0)
  const [transferCost, setTransferCost] = useState(0)
  const [recentActivities, setRecentActivities] = useState<MonthlyActivity[]>([])
  const [recentTransfers, setRecentTransfers] = useState<MaterialTransfer[]>([])
  const [totalEmployeesCount, setTotalEmployeesCount] = useState(0)

  // Activity days set for mini calendar
  const [activityDays, setActivityDays] = useState<number[]>([])

  // Quick modals
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const loadDashboardData = useCallback(async () => {
    if (!employee) return
    setIsLoading(true)

    try {
      // 1. Fetch activities for the current month
      const actRes = await activityService.getActivities({
        startDate: startOfMonth,
        endDate: endOfMonth,
        pageSize: 100,
        // If not admin, RLS filters automatically; if admin, get company-wide or personal
        employeeId: isAdmin ? undefined : employee.id,
      })

      const activities = actRes.data
      setActivityCount(actRes.totalCount)
      setRecentActivities(activities.slice(0, 5))

      // Calculate total kilometers for activity travel allowance
      const calculatedKm = activities.reduce((sum, item) => sum + (Number(item.to_kilometer) || 0), 0)
      setTotalKm(calculatedKm)

      // Collect days of this month with activities
      const days = activities
        .map((a) => {
          const d = new Date(a.date)
          return d.getDate()
        })
        .filter(Boolean)
      setActivityDays(Array.from(new Set(days)))

      // 2. Fetch material transfers for the current month
      const transRes = await materialTransferService.getTransfers({
        startDate: startOfMonth,
        endDate: endOfMonth,
        pageSize: 100,
        employeeId: isAdmin ? undefined : employee.id,
      })

      setTransferCount(transRes.totalCount)
      setRecentTransfers(transRes.data.slice(0, 5))

      // Totals
      const totals = await materialTransferService.getTotals({
        startDate: startOfMonth,
        endDate: endOfMonth,
        employeeId: isAdmin ? undefined : employee.id,
      })
      setTransferCost(totals.totalCost)

      // 3. Admin specific metric: total registered employees
      if (isAdmin) {
        const employees = await employeeService.getEmployees({ pageSize: 1 })
        setTotalEmployeesCount(employees.totalCount)
      }
    } catch (err) {
      console.error('Error loading dashboard stats:', err)
    } finally {
      setIsLoading(false)
    }
  }, [employee, isAdmin, startOfMonth, endOfMonth])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  const handleCreateActivity = async (data: any) => {
    if (!employee) return
    setSubmitting(true)
    const res = await activityService.createActivity(employee.id, data)
    setSubmitting(false)
    if (res.success) {
      success('Activity record saved successfully!')
      setShowActivityModal(false)
      loadDashboardData()
    } else {
      error(res.error || 'Failed to save activity record.')
    }
  }

  const handleCreateTransfer = async (data: any) => {
    if (!employee) return
    setSubmitting(true)
    const res = await materialTransferService.createTransfer(employee.id, data)
    setSubmitting(false)
    if (res.success) {
      success('Material transfer saved successfully!')
      setShowTransferModal(false)
      loadDashboardData()
    } else {
      error(res.error || 'Failed to save material transfer.')
    }
  }

  // Mini calendar calculation
  const daysInMonth = lastDay
  const firstDayWeekday = new Date(currentYear, currentMonthNumber - 1, 1).getDay()

  return (
    <div className="space-y-6">
      {/* Employee Profile Banner */}
      {employee && (
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/15 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
            <Building2 className="w-64 h-64 -mr-16" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-blue-200">
                  {currentMonthName}
                </span>
                {isAdmin && (
                  <Badge variant="primary" size="sm" className="bg-white/20 text-white border-white/30 text-[10px]">
                    <ShieldCheck className="w-3 h-3 mr-0.5" /> Administrator Dashboard
                  </Badge>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Welcome back, {employee.employee_name}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-blue-100/90 pt-1">
                <span className="font-mono bg-blue-900/40 px-2 py-0.5 rounded text-white">
                  {employee.employee_id}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-blue-200" />
                  {employee.designation}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-200" />
                  {employee.department}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-200" />
                  {employee.location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 md:pt-0">
              <button
                onClick={() => setShowActivityModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-blue-700 font-bold text-xs shadow-md hover:bg-blue-50 active:scale-95 transition"
              >
                <Plus className="w-4 h-4" /> Log Activity
              </button>
              <button
                onClick={() => setShowTransferModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-900/50 text-white border border-white/20 font-bold text-xs hover:bg-blue-900/70 active:scale-95 transition"
              >
                <Truck className="w-4 h-4" /> Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Navigation Buttons */}
      <QuickActions
        onOpenActivityModal={() => setShowActivityModal(true)}
        onOpenTransferModal={() => setShowTransferModal(true)}
      />

      {/* Primary Key Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Activity Count"
          value={isLoading ? '...' : activityCount}
          subtitle={`Total logs in ${currentMonthName}`}
          icon={CalendarCheck2}
          colorScheme="blue"
        />

        <StatCard
          title="Total Travel Allowance Km"
          value={isLoading ? '...' : formatKilometers(totalKm)}
          subtitle="Distance logged this month"
          icon={Gauge}
          colorScheme="purple"
        />

        <StatCard
          title="Material Transfers"
          value={isLoading ? '...' : transferCount}
          subtitle="Logistics dispatches logged"
          icon={Truck}
          colorScheme="emerald"
        />

        <StatCard
          title="Material Transfer Cost"
          value={isLoading ? '...' : formatCurrency(transferCost)}
          subtitle="Total logistics spend"
          icon={IndianRupee}
          colorScheme="amber"
        />
      </div>

      

      {/* Recent Records & Mini Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Activities & Transfers (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <RecentActivitiesList activities={recentActivities} />
          <RecentMaterialTransfersList transfers={recentTransfers} />
        </div>

        {/* Right Column: Month Calendar Widget */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-purple-600" />
                <CardTitle>{currentMonthName}</CardTitle>
              </div>
              <Link
                to="/calendar"
                className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 transition"
              >
                Full Calendar <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent>
              {/* Mini calendar grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
                <span>Su</span>
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {/* Empty lead cells */}
                {Array.from({ length: firstDayWeekday }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-8" />
                ))}

                {/* Days of month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1
                  const isToday = dayNum === now.getDate()
                  const hasActivity = activityDays.includes(dayNum)

                  return (
                    <div
                      key={`day-${dayNum}`}
                      className={`h-8 flex flex-col items-center justify-center rounded-lg transition relative font-medium ${
                        isToday ? 'bg-blue-600 text-white font-bold shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{dayNum}</span>
                      {hasActivity && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                            isToday ? 'bg-white' : 'bg-blue-600'
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>Activity Logged</span>
                </div>
                <span>{activityDays.length} active days</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick tips card */}
          
        </div>
      </div>

      {/* Modal: Add Activity */}
      {showActivityModal && (
        <Modal
          isOpen={showActivityModal}
          onClose={() => setShowActivityModal(false)}
          title="Log Monthly Activity & Travel Allowance"
          description="Record daily work, reporting authority, and vehicle kilometers"
          maxWidth="lg"
        >
          <ActivityForm
            onSubmit={handleCreateActivity}
            onCancel={() => setShowActivityModal(false)}
            isLoading={submitting}
          />
        </Modal>
      )}

      {/* Modal: Add Material Transfer */}
      {showTransferModal && (
        <Modal
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          title="Record Material Transfer"
          description="Log origin, destination, distance, and logistics costs"
          maxWidth="lg"
        >
          <MaterialTransferForm
            onSubmit={handleCreateTransfer}
            onCancel={() => setShowTransferModal(false)}
            isLoading={submitting}
          />
        </Modal>
      )}
    </div>
  )
}

