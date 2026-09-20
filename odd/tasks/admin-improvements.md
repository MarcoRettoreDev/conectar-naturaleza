# Admin improvements

## Goal
Modernize the admin finance workflow with persistent browser sessions, clearer movement creation, mobile-first navigation, formatted amounts, safer deletion, filtering, theming, and PWA polish.

## Clarified decisions
- Session persists in this browser via local storage until logout or site data is cleared.
- Amount format is Spanish: `1.234,56` (dot thousands, comma decimals).
- Two tabs only: `Resumen` and `Historial`; Historial includes the complete history and a selectable month filter.
- Existing model remains: `reserva` creates the current reservation/income record; `gasto` creates an expense/egress record.
- Description is optional and secondary in detail views.

## Tasks
1. Refactor admin state/navigation into two tabs and floating movement flow. **Done:** implemented in `admin/src/main.tsx` and `admin/src/styles.css`; admin tests/build passed.
2. Add formatted float inputs and optional expense description with updated validation. **Done:** added `admin/src/lib/money.ts`, tests, and updated forms/validation; tests/build passed.
3. Add toast feedback, delete confirmation modal, and prioritized detail views. **Done:** implemented in `admin/src/main.tsx`/`styles.css`; tests/build/diff check passed.
4. Add history filters (month, platform) and reservation passenger search. **Done:** added `history.ts` helpers/tests and mobile controls; tests/build passed.
5. Persist browser session and add dark/light mode toggle. **Done:** added `preferences.ts` helpers/tests, local browser auth persistence, logout, theme toggle, and early theme initialization; tests/build passed.
6. Add admin PWA logo/manifest integration and remove any Netlify badge. **Done:** added admin manifest, reused `web/public/favicons` assets, and verified both builds; no badge found.
7. Add focused tests and run admin/web verification. **Done:** admin tests (18), admin build, web build, diff check, badge search, and manifest icon validation passed. Browser/E2E interaction remains unverified.

## Acceptance evidence
- [x] Each task has implementation and focused verification evidence.
- [x] Existing behavior and persisted data remain compatible.
- [ ] Mobile layout works without horizontal overflow.
- [x] Build and tests pass for affected packages.

## Progress
- [x] Completed; browser/E2E interaction remains unverified.
