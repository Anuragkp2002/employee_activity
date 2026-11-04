import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { cn } from '../utils/formatters'
import {
  Building2,
  Lock,
  Hash,
  AlertCircle,
  ArrowRight,
  UserPlus,
  LogIn,
  User,
  Briefcase,
  MapPin,
  Sparkles,
  CheckCircle2,
  CalendarDays,
  ChartNoAxesCombined,
  ShieldCheck,
} from 'lucide-react'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, register } = useAuth()

  // Mode: 'login' or 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register Form State
  const [regName, setRegName] = useState('')
  const [regEmpId, setRegEmpId] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regCompanyName, setRegCompanyName] = useState('')
  const [regDesignation, setRegDesignation] = useState('')
  const [regDepartment, setRegDepartment] = useState('')
  const [regLocation, setRegLocation] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')

  // UI States
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)


  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMessage('Please enter both email and password.')
      return
    }

    setIsLoading(true)
    const result = await login(loginEmail, loginPassword)
    setIsLoading(false)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please verify credentials.')
    }
  }

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!regName.trim() || !regEmpId.trim() || !regEmail.trim() || !regCompanyName.trim() || !regPassword) {
      setErrorMessage('Full Name, Employee ID, email, Company Name, and password are required.')
      return
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.')
      return
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify and try again.')
      return
    }

    setIsLoading(true)
    const result = await register({
      employee_name: regName.trim(),
      employee_id: regEmpId.trim(),
      email: regEmail.trim(),
      company_name: regCompanyName.trim(),
      designation: regDesignation.trim() || 'Employee',
      department: regDepartment.trim() || 'General',
      location: regLocation.trim() || 'Headquarters',
      password: regPassword,
    })
    setIsLoading(false)

    if (result.success) {
      if (result.needsEmailConfirmation) {
        setSuccessMessage('Account created. Check your email to confirm the address, then sign in.')
        setAuthMode('login')
      } else {
        setSuccessMessage('Account registered successfully! Redirecting to dashboard...')
        setTimeout(() => navigate('/dashboard'), 1000)
      }
    } else {
      setErrorMessage(result.error || 'Registration failed. Please check details.')
    }
  }


  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07101d] font-sans text-white selection:bg-cyan-300 selection:text-slate-950">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_14%_12%,rgba(37,99,235,0.30),transparent_38%),radial-gradient(ellipse_at_88%_82%,rgba(13,148,136,0.20),transparent_38%),linear-gradient(135deg,#07101d_0%,#0d1b2c_52%,#0b1322_100%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.11] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-28 top-1/4 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-teal-400/15 blur-[110px]" />

      <main className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-4 py-7 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(420px,500px)] lg:gap-16 lg:px-12 lg:py-12">
        <section className="hidden lg:flex flex-col justify-center py-10">
          <div className="mb-16 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg shadow-blue-950/30 backdrop-blur-xl">
              <Building2 className="h-6 w-6 text-cyan-200" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight">ActivityTrack</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Workforce portal</div>
            </div>
          </div>

          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/[0.07] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_12px_rgba(94,234,212,0.9)]" />
            Attendance · Travel · Operations
          </div>
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.12] tracking-tight xl:text-6xl">
            A clearer view of <span className="bg-gradient-to-r from-cyan-200 via-blue-200 to-white bg-clip-text text-transparent">every workday.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
            Keep attendance, field activity, travel allowance, and material movement together in one workspace.
          </p>

          <div className="mt-12 grid max-w-2xl grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-md">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-400/10 text-blue-200"><CalendarDays className="h-4 w-4" /></div>
              <div className="text-sm font-semibold text-white">Daily activity</div>
              <div className="mt-1 text-xs leading-5 text-slate-400">Capture field work and travel details.</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-md">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-teal-300/10 text-teal-200"><ChartNoAxesCombined className="h-4 w-4" /></div>
              <div className="text-sm font-semibold text-white">Useful reports</div>
              <div className="mt-1 text-xs leading-5 text-slate-400">Review records and export summaries.</div>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-teal-300" />
            Secure sign-in for your organization
          </div>
        </section>

        <section className="mx-auto w-full max-w-[500px]">
          <div className="mb-6 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
              <Building2 className="h-5 w-5 text-cyan-200" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight">ActivityTrack</div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">Workforce portal</div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/20 bg-white/[0.10] p-5 shadow-[0_24px_90px_-25px_rgba(0,0,0,0.78)] backdrop-blur-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-100/75">Your workspace</p>
                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
                  {authMode === 'login' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="mt-1.5 text-xs leading-5 text-slate-300">
                  {authMode === 'login' ? 'Sign in with your work email to continue.' : 'Enter your employee details to get started.'}
                </p>
              </div>
              <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] sm:flex">
                {authMode === 'login' ? <LogIn className="h-5 w-5 text-cyan-100" /> : <UserPlus className="h-5 w-5 text-cyan-100" />}
              </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-slate-950/25 p-1.5">
              <button type="button" onClick={() => { setAuthMode('login'); setErrorMessage(null); setSuccessMessage(null) }}
                className={cn('flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all', authMode === 'login' ? 'border border-white/15 bg-white/15 text-white shadow-lg shadow-black/10' : 'text-slate-400 hover:bg-white/[0.06] hover:text-white')}>
                <LogIn className="h-3.5 w-3.5" /> Sign in
              </button>
              <button type="button" onClick={() => { setAuthMode('register'); setErrorMessage(null); setSuccessMessage(null) }}
                className={cn('flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all', authMode === 'register' ? 'border border-white/15 bg-white/15 text-white shadow-lg shadow-black/10' : 'text-slate-400 hover:bg-white/[0.06] hover:text-white')}>
                <UserPlus className="h-3.5 w-3.5" /> Register
              </button>
            </div>

            {errorMessage && (
              <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-300/25 bg-rose-400/10 p-3.5 text-xs leading-5 text-rose-100">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div role="status" className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-300/25 bg-emerald-300/10 p-3.5 text-xs leading-5 text-emerald-100">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                <span>{successMessage}</span>
              </div>
            )}

            {authMode === 'login' && (
              <form className="space-y-4" onSubmit={handleLoginSubmit}>
                <Input label="Email address" type="email" placeholder="name@company.com" required autoComplete="username"
                  value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} helperText="Use your registered work email" />
                <Input label="Password" type="password" placeholder="Enter your password" required autoComplete="current-password"
                  value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} leftIcon={<Lock className="h-4 w-4" />} />
                <Button type="submit" variant="primary" className="mt-2 w-full rounded-xl py-3 text-sm font-semibold shadow-lg shadow-blue-900/30" isLoading={isLoading}>
                  Sign in to your account <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
                <p className="pt-1 text-center text-xs text-slate-300">
                  New to ActivityTrack?{' '}
                  <button type="button" onClick={() => { setAuthMode('register'); setErrorMessage(null); setSuccessMessage(null) }} className="font-semibold text-cyan-200 underline decoration-cyan-200/40 underline-offset-4 hover:text-white">Create an account</button>
                </p>
              </form>
            )}

            {authMode === 'register' && (
              <form className="space-y-3.5" onSubmit={handleRegisterSubmit}>
                <div className="flex items-start gap-2.5 rounded-xl border border-cyan-200/15 bg-cyan-100/[0.07] px-3.5 py-3 text-[11px] leading-5 text-cyan-50/90">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-200" />
                  <span><strong>First account?</strong> The first account in a new project becomes its administrator.</span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input label="Full name" type="text" placeholder="Jane Doe" required value={regName} onChange={(e) => setRegName(e.target.value)} leftIcon={<User className="h-4 w-4" />} />
                  <Input label="Employee ID" type="text" placeholder="EMP1001" required value={regEmpId} onChange={(e) => setRegEmpId(e.target.value)} leftIcon={<Hash className="h-4 w-4" />} />
                </div>
                <Input label="Email address" type="email" placeholder="name@company.com" required autoComplete="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} leftIcon={<User className="h-4 w-4" />} />
                <Input label="Company name" type="text" placeholder="Your company" required value={regCompanyName} onChange={(e) => setRegCompanyName(e.target.value)} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input label="Designation" type="text" placeholder="Site Engineer" value={regDesignation} onChange={(e) => setRegDesignation(e.target.value)} leftIcon={<Briefcase className="h-4 w-4" />} />
                  <Input label="Department" type="text" placeholder="Operations" value={regDepartment} onChange={(e) => setRegDepartment(e.target.value)} leftIcon={<Building2 className="h-4 w-4" />} />
                </div>
                <Input label="Location / site" type="text" placeholder="Headquarters or Site Alpha" value={regLocation} onChange={(e) => setRegLocation(e.target.value)} leftIcon={<MapPin className="h-4 w-4" />} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input label="Password" type="password" placeholder="At least 6 characters" required autoComplete="new-password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} leftIcon={<Lock className="h-4 w-4" />} />
                  <Input label="Confirm password" type="password" placeholder="Re-enter password" required autoComplete="new-password" value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} leftIcon={<Lock className="h-4 w-4" />} />
                </div>
                <Button type="submit" variant="primary" className="mt-2 w-full rounded-xl py-3 text-sm font-semibold shadow-lg shadow-blue-900/30" isLoading={isLoading}>
                  Create account <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
                <p className="pt-1 text-center text-xs text-slate-300">
                  Already registered?{' '}
                  <button type="button" onClick={() => { setAuthMode('login'); setErrorMessage(null); setSuccessMessage(null) }} className="font-semibold text-cyan-200 underline decoration-cyan-200/40 underline-offset-4 hover:text-white">Sign in</button>
                </p>
              </form>
            )}
          </div>
          <p className="mt-5 flex items-center justify-center gap-2 text-center text-[10px] tracking-wide text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-300" /> Supabase Auth · Protected employee workspace
          </p>
        </section>
      </main>
    </div>
  )
}
