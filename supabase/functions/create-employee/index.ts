import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const url = Deno.env.get('SUPABASE_URL')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !anonKey || !serviceRoleKey) return json({ error: 'The Edge Function is missing server configuration.' }, 500)

    const authorization = req.headers.get('Authorization')
    if (!authorization) return json({ error: 'Sign in as an administrator first.' }, 401)
    const callerClient = createClient(url, anonKey, { global: { headers: { Authorization: authorization } } })
    const { data: { user }, error: userError } = await callerClient.auth.getUser()
    if (userError || !user) return json({ error: 'Your session is invalid. Sign in again.' }, 401)

    const admin = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })
    const { data: actor, error: actorError } = await admin.from('employees').select('role, is_active').eq('auth_user_id', user.id).single()
    if (actorError || actor?.role !== 'admin' || !actor.is_active) return json({ error: 'Administrator access is required.' }, 403)

    const body = await req.json()
    const name = String(body.employee_name || '').trim()
    const employeeId = String(body.employee_id || '').trim().toUpperCase()
    const email = String(body.email || '').trim().toLowerCase()
    const companyName = String(body.company_name || '').trim()
    const designation = String(body.designation || '').trim()
    const location = String(body.location || '').trim()
    const department = String(body.department || '').trim()
    const password = String(body.password || '')
    const role = body.role === 'admin' ? 'admin' : 'employee'
    if (!name || !employeeId || !email || !companyName || !designation || !location || !department || password.length < 6) {
      return json({ error: 'Enter all employee details and a password of at least 6 characters.' }, 400)
    }

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { employee_name: name, employee_id: employeeId, company_name: companyName, designation, location, department },
    })
    if (createError || !created.user) return json({ error: createError?.message || 'Could not create Auth account.' }, 400)

    // The auth.users trigger creates the employee profile atomically with its identity.
    const { data: employee, error: profileError } = await admin.from('employees')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('auth_user_id', created.user.id)
      .select('*')
      .single()
    if (profileError || !employee) {
      await admin.auth.admin.deleteUser(created.user.id)
      return json({ error: profileError?.message || 'Could not create employee profile.' }, 500)
    }
    return json({ success: true, employee }, 201)
  } catch (error) {
    console.error('create-employee failed:', error)
    return json({ error: 'Unexpected employee registration error.' }, 500)
  }
})
