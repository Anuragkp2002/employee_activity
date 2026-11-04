# ActivityTrack

A mobile-friendly employee attendance, activity, travel allowance, and material transfer tracker built with React, TypeScript, Vite, and Supabase Auth/Postgres.

## Configure and run

Install dependencies and add your project's URL and publishable (or legacy anon) key to the root `.env` file:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

Then run:

```bash
npm install
npm run dev
```

Never put a Supabase secret/service-role key in a `VITE_` variable or browser code.

## Initialize a new Supabase project

1. In the Supabase Dashboard, open **SQL Editor** and run the SQL files in `supabase/migrations/` in timestamp order. If the initial schema is already installed, also run `20261105000001_add_activity_to_location.sql` and `20261105000002_add_employee_company_name.sql` so existing projects receive the new columns and signup metadata update.
2. In **Authentication → URL Configuration**, allow your local app URL (`http://localhost:5173`) and production URL for redirects.
3. Enable email/password sign-up in **Authentication → Providers → Email**. If email confirmation is on, new users must confirm their email before signing in.
4. The first account registered through the app becomes the initial administrator. Register that account yourself before sharing the app. Later self-registrations receive the employee role. For a private company portal, disable public sign-ups after creating the first admin; admin-created accounts still work through the Edge Function.
5. To let admins create employee accounts from Employee Management, initialize and deploy the `create-employee` Edge Function:

   ```bash
   npx supabase init
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase functions deploy create-employee --project-ref YOUR_PROJECT_REF
   ```

   The function checks the caller's admin profile and uses server-side Supabase credentials. Do not add a service-role/secret key to the frontend.

## Features

- Email/password sign-in and registration, employee profiles, and role-based routes
- Employee directory with search, filters, sorting, and pagination
- Employee activity and travel allowance logs
- Material transfer records with distance and cost totals
- Activity calendar and filtered Excel reports
- Row-level database policies that scope employee records and reserve management for admins
