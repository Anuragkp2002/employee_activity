import React from 'react'
import { cn } from '../../utils/formatters'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline'
  size?: 'sm' | 'md'
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'secondary',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    outline: 'bg-transparent text-slate-700 border-slate-300',
  }

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

