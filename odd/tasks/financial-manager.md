# Financial manager for Conectar Naturaleza

## Objective
Create a small mobile-style financial manager for recording reservation income and cabin expenses, with monthly profitability summaries, deployed as a separate free Netlify site.

## Decisions
- Admin is a separate React + TypeScript application under `admin/`.
- Persistence is browser-local; no backend or paid service is introduced.
- Authentication is a fixed password client-side gate for this personal prototype; it is explicitly not treated as strong security.
- Monthly nights metrics are total nights, arithmetic average, and median.
- The public Astro website remains unchanged.
- Generated technical artifacts remain in English, matching repository conventions.

## Tasks

- [x] ODD-1: Create the admin React/Vite foundation, styling, scripts, and separate Netlify configuration.
- [x] ODD-2: Implement typed local financial storage, authentication gate, validation, and calculation utilities.
- [x] ODD-3: Implement reservation income and expense entry flows.
- [x] ODD-4: Implement monthly dashboard and movement history.
- [x] ODD-5: Verify tests/build and document deployment configuration.

## Authorized scope
`admin/`, root `package.json`, `pnpm-workspace.yaml`, `README.md`, `netlify.toml` only when required for independent admin deployment, and this task document plus its Engram mirror. Do not modify `web/` unless explicitly requested.

## Acceptance criteria
- Admin runs independently from `admin/` and builds for a separate Netlify site.
- Password gate prevents access to the dashboard in the browser.
- Reservation income supports dates, automatic nights, guest, guests count, platform, WhatsApp contact link, totals, paid amount, and automatic balance.
- Expenses support variable and extraordinary types with requested fields and categories.
- Monthly dashboard shows income, total expenses, primary result, guests, most-used platform, total nights, average, median, and movement history.
- Data persists across reloads in the same browser.
- Vitest covers core calculations and validation.
- Public `web/` behavior remains unchanged.

## Progress

### ODD-1
Completed. Created `admin/` as a standalone React/Vite/TypeScript app with Tailwind styling, package scripts, and `netlify.admin.toml` for a separate Netlify site.

### ODD-2
Completed. Added typed Zustand persistence, versioned storage with invalid-state recovery, fixed client-side password gate, calculations, and centralized validation.

### ODD-3
Completed. Added reservation and expense forms with automatic nights, balance, WhatsApp links, requested Spanish variable categories, extraordinary descriptions limited to 255 characters, and visible validation errors.

### ODD-4
Completed. Added monthly income/expense/result dashboard, guests, main platform, total/average/median nights, and movement history.

### ODD-5
Completed. Added Vitest coverage for calculations and validation and documented separate Netlify deployment.

## Verification evidence
- `pnpm --filter conectar-naturaleza-admin test`: PASS — 2 test files, 9 tests.
- `pnpm --filter conectar-naturaleza-admin build`: PASS.
- Generated `admin/dist` and `admin/tsconfig.tsbuildinfo` are ignored and not tracked.
- `netlify.admin.toml` uses `base = "admin"` and `publish = "dist"`.
- No commits created; delivery remains in the working tree for review.
