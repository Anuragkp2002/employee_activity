import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { employeeService } from '../services/employeeService'
import { EmployeeFormData } from '../types'
import { EmployeeForm } from '../components/forms/EmployeeForm'
import { Card, CardContent } from '../components/ui/Card'
import { useToast } from '../components/ui/Toast'
import { UserPlus, ArrowLeft } from 'lucide-react'

export const EmployeeRegistrationPage: React.FC = () => {
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: EmployeeFormData) => {
    setIsSubmitting(true)
    const res = await employeeService.registerEmployee(formData)
    setIsSubmitting(false)

    if (res.success) {
      success(`Employee "${formData.employee_name}" (${formData.employee_id}) registered successfully!`)
      navigate('/employees')
    } else {
      error(res.error || 'Failed to register employee.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/employees"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Employee Management
        </Link>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Employee Registration
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          Register and provision a new employee profile and secure authentication credentials
        </p>
      </div>

      {/* Registration Card */}
      <Card>
        <CardContent className="p-6 sm:p-8">
          <EmployeeForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/employees')}
            isLoading={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  )
}

