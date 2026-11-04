import React from 'react'
import { Menu, ShieldCheck, User } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Badge } from '../ui/Badge'

interface HeaderProps {
  onOpenMobileMenu: () => void
  title?: string
  subtitle?: string
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu, title, subtitle }) => {
  const { employee, isAdmin } = useAuth()

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          {title && <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">{title}</h1>}
          {subtitle && <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {employee && (
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/60 rounded-full py-1 pl-2.5 pr-3">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {employee.employee_name?.slice(0, 1).toUpperCase() || <User className="w-3.5 h-3.5" />}
            </div>
            <div className="text-left hidden md:block">
              <span className="block text-xs font-semibold text-slate-800 leading-tight">
                {employee.employee_name}
              </span>
              <span className="block text-[10px] text-slate-500 font-mono">
                {employee.employee_id} • {employee.department}
              </span>
            </div>
            {isAdmin ? (
              <Badge variant="primary" size="sm" className="hidden sm:inline-flex">
                <ShieldCheck className="w-3 h-3 mr-0.5 text-blue-600" /> Admin
              </Badge>
            ) : (
              <Badge variant="secondary" size="sm" className="hidden sm:inline-flex">
                {employee.designation}
              </Badge>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

