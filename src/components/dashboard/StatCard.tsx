import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Card } from '../ui/Card'
import { cn } from '../../utils/formatters'

export interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  colorScheme?: 'blue' | 'emerald' | 'purple' | 'amber' | 'slate'
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme = 'blue',
}) => {
  const schemeStyles = {
    blue: {
      bg: 'bg-blue-50 text-blue-700',
      badge: 'text-blue-700',
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-700',
      badge: 'text-emerald-700',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-700',
      badge: 'text-purple-700',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-700',
      badge: 'text-amber-700',
    },
    slate: {
      bg: 'bg-slate-100 text-slate-700',
      badge: 'text-slate-700',
    },
  }

  const currentScheme = schemeStyles[colorScheme]

  return (
    <Card className="p-5 hover:shadow-md transition duration-200">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className={cn('p-3 rounded-xl shrink-0', currentScheme.bg)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  )
}

