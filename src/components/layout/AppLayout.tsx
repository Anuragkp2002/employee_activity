import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Get current page titles based on route
  const getPageTitle = () => {
    const path = location.pathname
    if (path.startsWith('/dashboard')) return { title: 'Dashboard', subtitle: 'Overview of your attendance and operations' }
    if (path.startsWith('/employees/register')) return { title: 'Employee Registration', subtitle: 'Register a new employee into the system' }
    if (path.startsWith('/employees')) return { title: 'Employee Management', subtitle: 'Register and manage employee information' }
    if (path.startsWith('/activities')) return { title: 'Monthly Activity & TA', subtitle: 'Record and manage travel allowance and work logs' }
    if (path.startsWith('/transfers')) return { title: 'Material Transfer', subtitle: 'Track material transfers, distances, and logistics costs' }
    if (path.startsWith('/calendar')) return { title: 'Activity Calendar', subtitle: 'Monthly timeline of logged activities' }
    if (path.startsWith('/reports')) return { title: 'Reports & Excel Export', subtitle: 'Generate official company records and download spreadsheets' }
    if (path.startsWith('/profile')) return { title: 'My Profile', subtitle: 'Personal employee profile details' }
    return { title: 'Activity Tracking System', subtitle: 'Employee Portal' }
  }

  const { title, subtitle } = getPageTitle()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block h-screen sticky top-0 shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Slide-over Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-72 h-full bg-white shadow-2xl flex flex-col">
              <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            title={title}
            subtitle={subtitle}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  )
}

