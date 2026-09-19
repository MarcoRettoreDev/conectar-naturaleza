# Conectar Naturaleza

Conectar Naturaleza is organized as a small pnpm monorepo:

- `web/` contains the public Astro website and serves the site from `/`.
- `admin/` is a reserved boundary for the future administration panel.

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
