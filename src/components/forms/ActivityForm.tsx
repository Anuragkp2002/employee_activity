import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MonthlyActivity, ActivityFormData } from '../../types'
import { Input, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'
import { Calendar, MapPin, Gauge, UserCheck, Landmark } from 'lucide-react'

const activitySchema = z.object({
  date: z.string().min(1, 'Date is required'),
  activity: z.string().trim().min(1, 'Activity description is required'),
  ra: z.string().min(1, 'Reporting Authority (RA) is required'),
  from_location: z.string().min(1, 'Starting location (From) is required'),
  to_location: z.string().min(1, 'Destination location (To) is required'),
  to_kilometer: z.coerce
    .number({ message: 'Must be a valid number' })
    .min(0, 'Kilometers cannot be negative'),
  site_name: z.string().min(1, 'Site Name is required'),
})

type FormValues = z.infer<typeof activitySchema>

export interface ActivityFormProps {
  initialData?: MonthlyActivity | null
  onSubmit: (data: ActivityFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export const ActivityForm: React.FC<ActivityFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const isEditing = !!initialData
  const today = new Date().toISOString().split('T')[0]

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(activitySchema) as any,
    defaultValues: {
      date: initialData?.date || today,
      activity: initialData?.activity || '',
      ra: initialData?.ra || '',
      from_location: initialData?.from_location || '',
      to_location: initialData?.to_location || '',
      to_kilometer: initialData?.to_kilometer !== undefined ? Number(initialData.to_kilometer) : 0,
      site_name: initialData?.site_name || '',
    },
  })

  const handleFormSubmit = async (values: FormValues) => {
    await onSubmit({
      date: values.date,
      activity: values.activity,
      ra: values.ra,
      from_location: values.from_location,
      to_location: values.to_location,
      to_kilometer: values.to_kilometer,
      site_name: values.site_name,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date picker */}
        <Input
          label="Date"
          type="date"
          required
          leftIcon={<Calendar className="w-4 h-4" />}
          error={errors.date?.message}
          {...register('date')}
        />

        {/* Reporting Authority (RA) */}
        <Input
          label="Reporting Authority (RA)"
          placeholder="e.g. Project Manager / RA Name"
          required
          leftIcon={<UserCheck className="w-4 h-4" />}
          error={errors.ra?.message}
          {...register('ra')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* From Location */}
        <Input
          label="From Location"
          placeholder="e.g. Base Office / Site A"
          required
          leftIcon={<MapPin className="w-4 h-4" />}
          error={errors.from_location?.message}
          {...register('from_location')}
        />

        <Input
          label="To Location"
          placeholder="e.g. Site B / Client Office"
          required
          leftIcon={<MapPin className="w-4 h-4" />}
          error={errors.to_location?.message}
          {...register('to_location')}
        />

        {/* To Kilometer */}
        <Input
          label="To Kilometer"
          type="number"
          step="0.01"
          placeholder="0.00"
          required
          leftIcon={<Gauge className="w-4 h-4" />}
          error={errors.to_kilometer?.message}
          {...register('to_kilometer')}
        />
      </div>

      {/* Site Name */}
      <Input
        label="Site Name"
        placeholder="e.g. North Metro Terminal Sector 4"
        required
        leftIcon={<Landmark className="w-4 h-4" />}
        error={errors.site_name?.message}
        {...register('site_name')}
      />

      {/* Activity description */}
      <Textarea
        label="Activity Details"
        placeholder="Describe the activity, inspection, maintenance or task completed..."
        required
        rows={3}
        error={errors.activity?.message}
        {...register('activity')}
      />

      {/* Action buttons */}
      <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {isEditing ? 'Update Activity' : 'Save Activity'}
        </Button>
      </div>
    </form>
  )
}

