import React, { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/formatters'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, leftIcon, children, id, ...props }, ref) => {
    const selectId = id || props.name || Math.random().toString(36).substring(2, 7)

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative rounded-lg shadow-xs">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              {leftIcon}
            </div>
          )}
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'block w-full appearance-none rounded-lg border border-slate-300 bg-white px-3.5 py-2 pr-10 text-sm text-slate-900',
              'transition duration-150 ease-in-out',
              'focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20',
              'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
              leftIcon && 'pl-10',
              error && 'border-rose-400 focus:border-rose-600 focus:ring-rose-600/20 text-rose-900',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
