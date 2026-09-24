# Conectar Naturaleza

Conectar Naturaleza is organized as a small pnpm monorepo:

- `web/` contains the public Astro website and serves the site from `/`.
- `admin/` contains the browser-local financial administration panel, deployed as a separate Netlify site.

## Web development

Run application commands from `web/`:

```sh
cd web
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm preview
```

The root `pnpm-workspace.yaml` includes both `web/` and `admin/`. Netlify builds
the public application from `web/` and publishes `web/dist` at the site root.

## Admin development

Run the admin application from `admin/`:

```sh
cd admin
pnpm install
pnpm dev
pnpm test
pnpm build
```

The admin build and tests read the repository-root `.env.local` through the
configured Vite `envDir`. That file is ignored by Git; never commit its values.
Set these variables locally and in the admin Netlify site:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Only the public anon key belongs in the browser. Never set or expose
`VITE_SUPABASE_DB_PASSWORD` in browser code or any `VITE_*` variable.

### Supabase setup

1. Create the project in Supabase and apply
   `supabase/migrations/20250308000000_create_shared_admin_data.sql` in the SQL
   editor (or with the Supabase migration workflow).
2. In **Authentication → Users**, create the first user with the email and
   password that the admin panel will use. Email confirmation settings must allow
   that user to sign in.
3. Configure the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values in
   Netlify under the admin site's environment variables. Do not configure the
   database password there as a browser variable.

### Local-data migration

The admin panel keeps its existing browser-local records as a backup. After the
first successful sign-in, it detects the Zustand finance data in this browser and
shows **Subir datos a mi cuenta**. Confirming explicitly uploads only validated
records whose IDs are not already in the account, marks migration complete for
that user, and keeps the original local-storage key. A failed upload does not
mark completion, so the local data can be retried. Migration is per user; a
previously completed user does not trigger it again.

The admin now authenticates exclusively through Supabase email/password auth;
there is no client-side fallback password. Set the Netlify package directory to
`admin`; Netlify discovers `admin/netlify.toml` there and publishes `dist`.
