import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MaterialTransfer, MaterialTransferFormData } from '../../types'
import { Input, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'
import { Calendar, MapPin, Gauge, IndianRupee, Package, Receipt } from 'lucide-react'

const transferSchema = z.object({
  entry_type: z.enum(['transfer', 'expense']),
  date: z.string().min(1, 'Date is required'),
  activity: z.string().min(3, 'Transfer details / activity is required (min 3 chars)'),
  from_location: z.string(),
  to_location: z.string(),
  total_kilometer: z.coerce
    .number({ message: 'Must be a valid number' })
    .min(0, 'Kilometers cannot be negative'),
  cost: z.coerce
    .number({ message: 'Must be a valid number' })
    .min(0, 'Cost cannot be negative'),
}).superRefine((values, ctx) => {
  if (values.entry_type === 'transfer') {
    if (!values.from_location.trim()) ctx.addIssue({ code: 'custom', path: ['from_location'], message: 'Origin location (From) is required' })
    if (!values.to_location.trim()) ctx.addIssue({ code: 'custom', path: ['to_location'], message: 'Destination location (To) is required' })
  }
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
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(transferSchema) as any,
    defaultValues: {
      entry_type: initialData && !initialData.from_location && !initialData.to_location && !Number(initialData.total_kilometer) ? 'expense' : 'transfer',
      date: initialData?.date || today,
      activity: initialData?.activity || '',
      from_location: initialData?.from_location || '',
      to_location: initialData?.to_location || '',
      total_kilometer: initialData?.total_kilometer !== undefined ? Number(initialData.total_kilometer) : 0,
      cost: initialData?.cost !== undefined ? Number(initialData.cost) : 0,
    },
  })
  const entryType = watch('entry_type')

  const handleFormSubmit = async (values: FormValues) => {
    await onSubmit({
      date: values.date,
      activity: values.activity,
      from_location: values.entry_type === 'transfer' ? values.from_location : '',
      to_location: values.entry_type === 'transfer' ? values.to_location : '',
      total_kilometer: values.entry_type === 'transfer' ? values.total_kilometer : 0,
      cost: values.cost,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-700">Entry type</legend>
        <div className="grid grid-cols-2 gap-2">
          <label className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm font-medium transition ${entryType === 'transfer' ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 text-slate-600'}`}>
            <input type="radio" value="transfer" className="accent-teal-600" {...register('entry_type')} />
            <Package className="h-4 w-4" /> Material transfer
          </label>
          <label className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm font-medium transition ${entryType === 'expense' ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 text-slate-600'}`}>
            <input type="radio" value="expense" className="accent-teal-600" {...register('entry_type')} />
            <Receipt className="h-4 w-4" /> Other expense
          </label>
        </div>
      </fieldset>
      {/* Date picker */}
      <Input
        label="Date"
        type="date"
        required
        leftIcon={<Calendar className="w-4 h-4" />}
        error={errors.date?.message}
        {...register('date')}
      />

      {entryType === 'transfer' && <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>}

      <div className={`grid grid-cols-1 ${entryType === 'transfer' ? 'sm:grid-cols-2' : ''} gap-4`}>
        {/* Total Kilometer */}
        {entryType === 'transfer' && <Input
          label="Total Kilometer"
          type="number"
          step="0.01"
          placeholder="0.00"
          required
          leftIcon={<Gauge className="w-4 h-4" />}
          error={errors.total_kilometer?.message}
          {...register('total_kilometer')}
        />}

        {/* Cost */}
        <Input
          label={entryType === 'transfer' ? 'Transfer Cost (₹)' : 'Expense Cost (₹)'}
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
        label={entryType === 'transfer' ? 'Material / Transfer Activity Description' : 'Expense Description'}
        placeholder={entryType === 'transfer' ? 'Detail items transferred, vehicle number, dispatch notes or invoice reference...' : 'e.g. Insulation tape, supplies, or other expense'}
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
          {isEditing ? 'Update Entry' : entryType === 'transfer' ? 'Save Material Transfer' : 'Save Expense'}
        </Button>
      </div>
    </form>
  )
}

