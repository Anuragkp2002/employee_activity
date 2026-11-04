import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Loader2 } from 'lucide-react'

export const AdminRoute: React.FC = () => {
  const { isAdmin, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
        <p className="text-xs text-slate-500">Checking permissions...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

