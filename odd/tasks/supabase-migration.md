# Supabase shared admin data

## Goal
Replace browser-only finance persistence with a shared Supabase database and authentication while preserving the current admin UI and local data migration path.

## Decisions
- Supabase PostgreSQL is the shared persistence layer.
- Supabase email/password auth replaces the client-side password check.
- Only the authenticated user may access finance rows via Row Level Security.
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are browser-safe configuration; `VITE_SUPABASE_DB_PASSWORD` is never used in frontend code and must not be exposed.
- No realtime synchronization is required initially; reads/writes refresh the current client.
- Existing localStorage data gets an explicit one-time migration action rather than automatic destructive replacement.

## Tasks
1. Add Supabase client/config and secure environment handling. **Done:** client, root env loading, and ignore rules added.
2. Add SQL schema, ownership columns, indexes, and RLS policies. **Done:** Supabase migration added under `supabase/migrations/`.
3. Replace local persistence actions with authenticated Supabase CRUD and loading/error states. **Done:** email/password auth and authenticated CRUD integrated.
4. Add one-time localStorage-to-Supabase migration and preserve local export fallback. **Done:** explicit validated migration with duplicate avoidance and backup preservation.
5. Update authentication, tests, documentation, and deployment verification. **Done:** mocked tests, README setup, env guidance, and stale-password documentation correction added.

## Progress
- [x] Implementation complete; live Supabase migration execution, first Auth user, and deployment verification remain pending.
