import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Loader2 } from 'lucide-react'

export const ProtectedRoute: React.FC = () => {
  const { user, employee, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 mb-4 animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
          Verifying Authenticated Session...
        </p>
      </div>
    )
  }

  if (!user || !employee || !employee.is_active) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

