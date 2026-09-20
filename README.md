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

Set `VITE_ADMIN_PASSWORD` in the admin site's environment to configure its fixed
client-side gate. If unset, the documented development fallback is
`conectar-admin`; this password is not suitable for sensitive production data.
Set the Netlify package directory to `admin`; Netlify discovers `admin/netlify.toml` there and publishes `dist`.
