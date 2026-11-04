import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'
import { EmployeeManagementPage } from '../pages/EmployeeManagementPage'
import { EmployeeRegistrationPage } from '../pages/EmployeeRegistrationPage'
import { MonthlyActivityPage } from '../pages/MonthlyActivityPage'
import { MaterialTransferPage } from '../pages/MaterialTransferPage'
import { CalendarPage } from '../pages/CalendarPage'
import { ReportsPage } from '../pages/ReportsPage'
import { ProfilePage } from '../pages/ProfilePage'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminRoute } from './AdminRoute'
import { AppLayout } from '../components/layout/AppLayout'

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/activities" element={<MonthlyActivityPage />} />
          <Route path="/transfers" element={<MaterialTransferPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/employees" element={<EmployeeManagementPage />} />
            <Route path="/employees/register" element={<EmployeeRegistrationPage />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

