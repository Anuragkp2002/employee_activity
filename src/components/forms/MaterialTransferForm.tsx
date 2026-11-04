import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MaterialTransfer, MaterialTransferFormData } from '../../types'
import { Input, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'
import { Calendar, MapPin, Gauge, IndianRupee } from 'lucide-react'

const transferSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  activity: z.string().min(3, 'Transfer details / activity is required (min 3 chars)'),
  from_location: z.string().min(1, 'Origin location (From) is required'),
  to_location: z.string().min(1, 'Destination location (To) is required'),
  total_kilometer: z.coerce
    .number({ message: 'Must be a valid number' })
    .min(0, 'Kilometers cannot be negative'),
  cost: z.coerce
    .number({ message: 'Must be a valid number' })
    .min(0, 'Cost cannot be negative'),
})

type FormValues = z.infer<typeof transferSchema>

export interface MaterialTransferFormProps {
  initialData?: MaterialTransfer | null
  onSubmit: (data: MaterialTransferFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export const MaterialTransferForm: React.FC<MaterialTransferFormProps> = ({
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
    resolver: zodResolver(transferSchema) as any,
    defaultValues: {
      date: initialData?.date || today,
      activity: initialData?.activity || '',
      from_location: initialData?.from_location || '',
      to_location: initialData?.to_location || '',
      total_kilometer: initialData?.total_kilometer !== undefined ? Number(initialData.total_kilometer) : 0,
      cost: initialData?.cost !== undefined ? Number(initialData.cost) : 0,
    },
  })

  const handleFormSubmit = async (values: FormValues) => {
    await onSubmit({
      date: values.date,
      activity: values.activity,
      from_location: values.from_location,
      to_location: values.to_location,
      total_kilometer: values.total_kilometer,
      cost: values.cost,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Date picker */}
      <Input
        label="Transfer Date"
        type="date"
        required
        leftIcon={<Calendar className="w-4 h-4" />}
        error={errors.date?.message}
        {...register('date')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* From Location */}
        <Input
          label="From (Origin)"
          placeholder="e.g. Central Warehouse"
          required
          leftIcon={<MapPin className="w-4 h-4" />}
          error={errors.from_location?.message}
          {...register('from_location')}
        />

        {/* To Location */}
        <Input
          label="To (Destination)"
          placeholder="e.g. Project Site Alpha"
          required
          leftIcon={<MapPin className="w-4 h-4" />}
          error={errors.to_location?.message}
          {...register('to_location')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Kilometer */}
        <Input
          label="Total Kilometer"
          type="number"
          step="0.01"
          placeholder="0.00"
          required
          leftIcon={<Gauge className="w-4 h-4" />}
          error={errors.total_kilometer?.message}
          {...register('total_kilometer')}
        />

        {/* Cost */}
        <Input
          label="Transfer Cost (₹)"
          type="number"
          step="0.01"
          placeholder="0.00"
          required
          leftIcon={<IndianRupee className="w-4 h-4" />}
          error={errors.cost?.message}
          {...register('cost')}
        />
      </div>

      {/* Activity description */}
      <Textarea
        label="Material / Transfer Activity Description"
        placeholder="Detail items transferred, vehicle number, dispatch notes or invoice reference..."
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
          {isEditing ? 'Update Transfer' : 'Save Material Transfer'}
        </Button>
      </div>
    </form>
  )
}

