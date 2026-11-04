import React, { useState, useEffect, useCallback } from 'react'
import { activityService } from '../services/activityService'
import { MonthlyActivity } from '../types'
import { useAuth } from '../hooks/useAuth'
import { formatDate, formatKilometers } from '../utils/formatters'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Landmark,
  UserCheck,
  MapPin,
  Clock,
  Layers,
} from 'lucide-react'

export const CalendarPage: React.FC = () => {
  const { employee, isAdmin } = useAuth()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [activities, setActivities] = useState<MonthlyActivity[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() // 0 - 11

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  // Calculate start and end date for current view
  const startOfMonth = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate()
  const endOfMonth = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  const fetchMonthActivities = useCallback(async () => {
    if (!employee) return
    setIsLoading(true)

    const res = await activityService.getActivities({
      startDate: startOfMonth,
      endDate: endOfMonth,
      pageSize: 500,
      employeeId: isAdmin ? undefined : employee.id,
    })

    setActivities(res.data)
    setIsLoading(false)
  }, [employee, isAdmin, startOfMonth, endOfMonth])

  useEffect(() => {
    fetchMonthActivities()
  }, [fetchMonthActivities])

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
    setSelectedDate(null)
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
    setSelectedDate(null)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(null)
  }

  // Days mapping
  const daysInMonth = lastDay
  const firstDayWeekday = new Date(currentYear, currentMonth, 1).getDay()

  // Group activities by date string (YYYY-MM-DD)
  const activitiesByDate = activities.reduce((acc, act) => {
    const key = act.date
    if (!acc[key]) acc[key] = []
    acc[key].push(act)
    return acc
  }, {} as Record<string, MonthlyActivity[]>)

  // Activities for the selected date
  const selectedDayActivities = selectedDate ? activitiesByDate[selectedDate] || [] : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Activity Calendar
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monthly schedule of completed site operations, work logs, and travel records
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleToday} className="text-xs">
            Today
          </Button>
          <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-xs">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-1 text-xs font-bold text-slate-800 min-w-32 text-center select-none">
              {monthName}
            </div>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calendar Grid (2 columns on large screen) */}
        <div className="lg:col-span-2">
          <Card className="p-4 sm:p-6">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty leading cells */}
              {Array.from({ length: firstDayWeekday }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="min-h-16 sm:min-h-24 bg-slate-50/50 rounded-xl border border-dashed border-slate-200/60"
                />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1
                const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
                const dayActivities = activitiesByDate[dateKey] || []
                const hasActivities = dayActivities.length > 0

                const isToday =
                  new Date().toISOString().split('T')[0] === dateKey
                const isSelected = selectedDate === dateKey

                return (
                  <div
                    key={`day-${dayNum}`}
                    onClick={() => setSelectedDate(dateKey)}
                    className={`min-h-16 sm:min-h-24 p-1.5 sm:p-2 rounded-xl border text-left cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20 shadow-xs'
                        : isToday
                        ? 'border-blue-300 bg-blue-50/20 shadow-xs'
                        : hasActivities
                        ? 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs'
                        : 'border-slate-100 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold rounded-md px-1.5 py-0.5 ${
                          isToday
                            ? 'bg-blue-600 text-white'
                            : isSelected
                            ? 'text-blue-700'
                            : 'text-slate-700'
                        }`}
                      >
                        {dayNum}
                      </span>

                      {hasActivities && (
                        <span className="hidden sm:inline-block text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded-full">
                          {dayActivities.length}
                        </span>
                      )}
                    </div>

                    {/* Desktop activity pills inside calendar cell */}
                    <div className="hidden sm:block space-y-1 mt-1 overflow-hidden">
                      {dayActivities.slice(0, 2).map((a) => (
                        <div
                          key={a.id}
                          className="text-[10px] bg-slate-100 hover:bg-blue-100/60 text-slate-800 rounded px-1.5 py-0.5 truncate font-medium flex items-center gap-1"
                          title={`${a.site_name}: ${a.activity}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                          <span className="truncate">{a.site_name}</span>
                        </div>
                      ))}
                      {dayActivities.length > 2 && (
                        <div className="text-[9px] font-semibold text-slate-400 pl-1">
                          +{dayActivities.length - 2} more
                        </div>
                      )}
                    </div>

                    {/* Mobile activity indicator dots */}
                    {hasActivities && (
                      <div className="sm:hidden flex items-center justify-center gap-0.5 mt-1">
                        {Array.from({ length: Math.min(3, dayActivities.length) }).map((_, dotIdx) => (
                          <span key={dotIdx} className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Side Panel: Selected Date Details */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <div>
                <CardTitle>
                  {selectedDate ? formatDate(selectedDate, 'EEEE, dd MMMM yyyy') : 'Date Activities'}
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedDate
                    ? `${selectedDayActivities.length} log(s) recorded on this date`
                    : 'Click any highlighted date on the calendar to view logged details'}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
              {!selectedDate && (
                <div className="p-8 text-center text-xs text-slate-400">
                  <CalendarIcon className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  Select a date from the calendar to inspect detailed activities and site visits.
                </div>
              )}

              {selectedDate && selectedDayActivities.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400">
                  No activity records logged on {formatDate(selectedDate, 'dd MMM yyyy')}.
                </div>
              )}

              {selectedDayActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <Landmark className="w-4 h-4 text-emerald-600 shrink-0" />
                        {act.site_name}
                      </h4>
                      {isAdmin && act.employee && (
                        <p className="text-xs font-semibold text-slate-600 mt-0.5">
                          {act.employee.employee_name} ({act.employee.employee_id})
                        </p>
                      )}
                    </div>
                    <span className="font-mono text-xs font-bold bg-white border border-slate-200 px-2 py-0.5 rounded shadow-xs">
                      {formatKilometers(act.to_kilometer)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/80">
                    {act.activity}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                    <div className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">RA: {act.ra}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">From: {act.from_location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">To: {act.to_location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

