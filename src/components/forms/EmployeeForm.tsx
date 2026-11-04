import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Employee, EmployeeFormData } from '../../types'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { User, Hash, Briefcase, MapPin, Building, KeyRound, Shield } from 'lucide-react'

const employeeSchema = z.object({
  employee_name: z.string().min(2, 'Employee Name is required (min 2 characters)'),
  employee_id: z
    .string()
    .min(2, 'Employee ID is required')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Employee ID must contain only alphanumeric characters, dashes, or underscores'),
  email: z.string().email('Enter a valid email address'),
  company_name: z.string().trim().min(1, 'Company Name is required'),
  designation: z.string().min(2, 'Designation is required'),
  location: z.string().min(2, 'Location is required'),
  department: z.string().min(2, 'Department is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional()
    .or(z.literal('')),
  role: z.enum(['employee', 'admin']),
})

type FormValues = z.infer<typeof employeeSchema>

export interface EmployeeFormProps {
  initialData?: Employee | null
  onSubmit: (data: EmployeeFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const isEditing = !!initialData

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employee_name: initialData?.employee_name || '',
      employee_id: initialData?.employee_id || '',
      email: initialData?.email || '',
      company_name: initialData?.company_name || '',
      designation: initialData?.designation || '',
      location: initialData?.location || '',
      department: initialData?.department || '',
      password: '',
      role: initialData?.role || 'employee',
    },
  })

  const handleFormSubmit = async (values: FormValues) => {
    const payload: EmployeeFormData = {
      employee_name: values.employee_name,
      employee_id: values.employee_id,
      email: values.email,
      company_name: values.company_name,
      designation: values.designation,
      location: values.location,
      department: values.department,
      role: values.role,
    }
    if (!isEditing || values.password) {
      payload.password = values.password || 'Employee123!'
    }
    await onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Auto-generated UUID display (Not editable) */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Local record ID
        </label>
        <div className="font-mono text-xs text-slate-600 truncate">
          {initialData?.id ? initialData.id : 'Generated automatically'}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Employee Name */}
        <Input
          label="Employee Name"
          placeholder="e.g. John Doe"
          required
          leftIcon={<User className="w-4 h-4" />}
          error={errors.employee_name?.message}
          {...register('employee_name')}
        />

        {/* Employee ID */}
        <Input
          label="Employee ID"
          placeholder="e.g. EMP1024"
          required
          disabled={isEditing}
          helperText={isEditing ? 'Employee ID is permanent and cannot be modified' : 'Must be unique across all employees'}
          leftIcon={<Hash className="w-4 h-4" />}
          error={errors.employee_id?.message}
          {...register('employee_id')}
        />
      </div>

      <Input
        label="Email address"
        type="email"
        placeholder="name@company.com"
        required
        disabled={isEditing}
        autoComplete="email"
        helperText={isEditing ? 'Email address is linked to the Auth account and cannot be changed here.' : 'Employee will use this email and password to sign in.'}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Company Name"
        placeholder="Enter company name"
        required
        error={errors.company_name?.message}
        {...register('company_name')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Designation */}
        <Input
          label="Designation"
          placeholder="e.g. Site Engineer"
          required
          leftIcon={<Briefcase className="w-4 h-4" />}
          error={errors.designation?.message}
          {...register('designation')}
        />

        {/* Location */}
        <Input
          label="Location"
          placeholder="e.g. Mumbai HQ"
          required
          leftIcon={<MapPin className="w-4 h-4" />}
          error={errors.location?.message}
          {...register('location')}
        />

        {/* Department */}
        <Input
          label="Department"
          placeholder="e.g. Operations"
          required
          leftIcon={<Building className="w-4 h-4" />}
          error={errors.department?.message}
          {...register('department')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Initial Password */}
        <div>
          <Input
            label={isEditing ? 'New Password (leave blank to keep current)' : 'Initial Account Password'}
            type="password"
            placeholder={isEditing ? '••••••••' : 'Min 6 characters'}
            required={!isEditing}
            leftIcon={<KeyRound className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password')}
          />
          {!isEditing && (
            <p className="mt-1 text-[11px] text-slate-500">
              Set the password the employee will use with their email address.
            </p>
          )}
        </div>

        {/* Role */}
        <Select
          label="Account Role"
          leftIcon={<Shield className="w-4 h-4" />}
          error={errors.role?.message}
          {...register('role')}
        >
          <option value="employee">Standard Employee</option>
          <option value="admin">Administrator (Full Access)</option>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {isEditing ? 'Save Changes' : 'Register Employee'}
        </Button>
      </div>
    </form>
  )
}

