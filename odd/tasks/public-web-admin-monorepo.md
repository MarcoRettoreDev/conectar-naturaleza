# Public web and admin monorepo layout

## Objective

Move the existing Astro public website into `web/` and reserve `admin/` for the administration panel that will be created next, without changing the public site's URL structure.

## Problem

The repository currently contains one Astro application at its root. A separate filesystem boundary is needed for the public website and the future admin application.

## Scope

- Move the Astro application and its app-local tooling into `web/`.
- Keep repository-level metadata, documentation, and deployment configuration at the root.
- Create the empty `admin/` application boundary without adding admin routes to the public site.
- Update deployment and documentation paths.

## Constraints

- The public site must continue serving from `/`, not `/web`.
- Do not move generated output such as `.astro/`, `dist/`, or `.codegraph/`.
- Do not create admin functionality in this task.

## Tasks

- [x] ODD-1: Move the Astro public application into `web/` and create the reserved `admin/` directory.
- [x] ODD-2: Update Netlify configuration and repository documentation for the monorepo layout.

## Authorized scope

`web/`, `admin/`, `netlify.toml`, `README.md`, `pnpm-workspace.yaml`, and this task document plus its Engram mirror.

## Acceptance criteria

- `web/package.json`, `web/src`, and `web/public` contain the public Astro application.
- `admin/` exists as a separate sibling boundary.
- Netlify builds from `web/` and publishes its `dist/` output.
- The documented commands and layout reference `web/` correctly.
- The application builds successfully from `web/` or any failure is recorded with its cause.

## Applicable checks

- `pnpm --dir web build`
- `pnpm --dir web lint`
- Structural checks for moved paths and generated output.

## Progress

ODD-1 completed. The Astro application files and app-local tooling now live under `web/`; `admin/` exists as an empty reserved boundary containing only `.gitkeep`. Root repository metadata remains at the repository root. Generated `.astro/`, `dist/`, and `.codegraph/` directories were not moved.

### ODD-1 evidence

- `web/package.json`, `web/src/`, `web/public/`, `web/pnpm-lock.yaml`, and the Astro/tooling configuration files exist.
- `admin/.gitkeep` is the only admin boundary file.
- Root `LICENSE`, `README.md`, `netlify.toml`, and repository metadata remain at root.

### ODD-2 evidence

- `netlify.toml` runs the web app through `pnpm --dir web` and publishes `web/dist` without changing the public URL root.
- `README.md` documents the `web/` public application, reserved `admin/` boundary, and commands run from `web/`.
- `pnpm-workspace.yaml` declares `web` and `admin` workspace boundaries.

## Next step

Done. The complete work unit is recorded in commit `6f82cea`.

### Verification evidence

- Structural checks: **PASS**. Verified the moved `web/` application, root metadata, `admin/.gitkeep`, absence of admin routes, and that root `.astro/`, `dist/`, and `.codegraph/` directories remain outside `web/`.
- `pnpm --dir web build`: **FAIL (environment)**. pnpm refused dependency setup with `ERR_PNPM_IGNORED_BUILDS` for `esbuild@0.25.12` and `sharp@0.33.5`; the environment requires build-script approval. Running the available Astro binary directly from `web/` reached image generation and then failed with `MissingSharp` because Sharp was not installed.
- `pnpm --dir web lint`: **FAIL (environment/baseline)**. pnpm again stopped at `ERR_PNPM_IGNORED_BUILDS`. Running the available ESLint binary directly from `web/` found five existing import-sort warnings and one existing baseline error: `web/src/components/Pricing/Facilities.astro:24:11` reports `FacilityItem` is already defined. No unrelated lint issues were changed.
- Generated output from verification (`web/.astro/` and `web/dist/`) is untracked/ignored and will not be committed. The temporary root `.codegraph/` index used for exploration was also not moved or committed.
