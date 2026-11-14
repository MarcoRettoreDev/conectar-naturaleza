# Microsite redesign (web/)

Replace the old Astro template on the public landing with the turismo-regional microsite UI (React islands inside Astro), driven by an editable `contents.json`. Keep WhatsApp quote requests; drop every platform feature.

## Specs

- S1. "basarnos en el proyecto: /Users/mrdev/Developer/Projects/turismo-regional y extraer o copiar los archivos de UI para armar la vista de micrositio que genera: https://turismoregional.com/cayasta/conectar-naturaleza"
- S2. "Tienes total libertad para reformatear los contenidos y que se ajusten a esas vistas, la idea es adaptarnos nosotros a esos componentes, no al revés."
- S3. "ese sitio es una plataforma, nosotros solamnete queremos una landing page para mostrar la información importante, por lo tanto el sistema de reservas/login/buscador no lo tenemos, simplemente quitémoslo de este sitio"
- S4. "mantengamos si el envió de whatsapp cuando se seleccionan las fechas/cantidad de personas, que el botón 'pedir cotización' te envié a una conversación de whatsapp preformateada con lo seleccionado (como se estaba haciendo hoy)"
- S5. "Los logos de TurismoRegional, deben ser reemplazados por el nuestro, elimina cualquier archivo que ya no vayamos a utilizar."
- S6. "crear un archivo contents.json, sobre todo para el tema de fotos q ahora se pone más complejo, luego podré editar los contenidos 1 a 1"
- S7. Decisions (L2): Astro + React islands; no price shown; Google Maps iframe embed (no API key); turismo-regional design tokens (colors, Instrument Sans).

## Tasks

- T1 [S1,S7] Add React/Tailwind deps and copy the UI primitives + design tokens. Route: inline + worker. Commit: 31b5cd2 [x]
- T2 [S6] Create `web/src/data/contents.json` and the build-time loader that turns photo files into gallery data. Route: worker. Commit: 31b5cd2 [x]
- T3 [S1,S2,S3,S4,S5] Port the microsite page (header, gallery, listing, quote card, bar, footer) with WhatsApp quote message + test. Route: worker (lib/whatsapp.ts + test done inline, GREEN 3/3). Commit: 31b5cd2 [x]
- T4 [S5] Delete the old template components, styles, data, icons, images and unused deps; update docs. Route: inline. Commit: 8409bd8 [x]
- T5 [all] Build, lint, test, and visual check. Route: inline. Commit: n/a [x]

## Log

- L1 (user, verbatim): "Vamos a hacer un refactor de este sitio, en su momento, había puesto un template que utilicé para mostrar 'correctamente' la información.

Hoy eso nos quedó viejo y no muy agradable, por lo tanto vamos a basarnos en el proyecto:
/Users/mrdev/Developer/Projects/turismo-regional

y extraer o copiar los archivos de UI para armar la vista de micrositio que genera:
https://turismoregional.com/cayasta/conectar-naturaleza

Tienes total libertad para reformatear los contenidos y que se ajusten a esas vistas, la idea es adaptarnos nosotros a esos componentes, no al revés.

Una cosa, ese sitio es una plataforma, nosotros solamnete queremos una landing page para mostrar la información importante, por lo tanto el sistema de reservas/login/buscador no lo tenemos, simplemente quitémoslo de este sitio, mantengamos si el envió de whatsapp cuando se seleccionan las fechas/cantidad de personas, que el botón 'pedir cotización' te envié a una conversación de whatsapp preformateada con lo seleccionado (como se estaba haciendo hoy)

Los logos de TurismoRegional, deben ser reemplazados por el nuestro, elimina cualquier archivo que ya no vayamos a utilizar.

Quias sea conveniente crear un archivo contents.json, sobre todo para el tema de fotos q ahora se pone más complejo, luego podré editar los contenidos 1 a 1 para poder ajustarlo a nuestra nuueva UI

Si tienes alguna duda, hazmela saber antes de suponer"
- L2 (user answers): Stack "Astro + islas React"; Precio "Sin precio"; Mapa "iframe embed"; Paleta "Tokens del micrositio".
- L3 (assumptions, stated to user): calendar disables only past days (no availability data); WhatsApp message carries dates, nights and guests (name/message fields dropped); owner avatar, favorites, reviews summary from platform, preview mode and rate/fare notices removed; testimonials become the «Opiniones» section; Booking/Airbnb scores replace the «Validado por Turismo Regional» badge.
- L4 (design notes for T1-T3, from parent exploration):
  - Already done inline: deps installed (@astrojs/react, react 19.2.3, radix dialog/popover/separator/slot, cva, clsx, tailwind-merge, tw-animate-css, lucide-react 0.561.0, date-fns 4.1.0, react-day-picker 9.12.0, @fontsource-variable/instrument-sans, vitest); old deps removed (mdx, rss, astro-auto-import, old fonts, @tailwindcss/forms). Copied verbatim from turismo-regional: `src/components/ui/{button,separator,popover,sheet,calendar}.tsx`, `src/lib/{justified-rows,beds}.ts`, `src/hooks/use-microsite-navigation.ts`, `src/components/microsite/{sliding-pill,photo-gallery,guest-selector,date-range-picker,review-card}.tsx` (still raw copies needing adaptation), `src/assets/horizonte.svg`. Written: `src/lib/{utils,date-only,guests,types,gallery,whatsapp}.ts`, `src/lib/whatsapp.test.ts`, `vitest.config.ts`, `pnpm test` script.
  - Source references: page `turismo-regional/resources/js/pages/accommodation-microsite.tsx`; body `components/accommodations/accommodation-listing.tsx`; header/footer/bar/booking-card `components/accommodations/accommodation-microsite-{header,footer}.tsx`, `accommodation-booking-{bar,card}.tsx`; tokens `resources/css/app.css` (the `@theme` block, `:root` vars and `@layer base`; drop sidebar/chart/Google Maps CSS).
  - Removed from the port: Inertia (`usePage`, `router`, `Head`), availability/quote/fares/checkout, owner avatar, favorites, preview mode, `viewer_is_owner`, toast (Compartir only shows «Link copiado» on the button), "Con tecnología de" seal, «Publicalo gratis» link, Google Maps JS (use iframe `https://maps.google.com/maps?q=LAT,LNG&z=15&output=embed` + «Cómo llegar» button).
  - Quote card: heading «Consultá disponibilidad y tarifa» (no price); DateRangePicker variant `fields` with only past days disabled (today computed client-side via formatDateOnly(new Date())); guest selector (max 6); button label «Elegí las fechas» (disabled) until both dates, then «Pedir cotización» opening `quoteUrl(phone, quoteMessage(greeting, ...))` in a new tab; note under it «Te respondemos por WhatsApp con la disponibilidad y la tarifa.». Mobile fixed bar: same label; without dates scrolls to `#reserva`.
  - Trust card (replaces «Validado por Turismo Regional»): `highlight` from contents: title «Nuestros huéspedes nos respaldan», text «Más de 100 reservas concretadas.», ratings Booking 9.0 (https://www.booking.com/hotel/ar/cabana-conectar-naturaleza.es-ar.html) and Airbnb 4,75 (https://www.airbnb.com.ar/rooms/1373439887419185949).
  - Header: our logo `src/icons/logo-black-transparent.png` (resized via getImage) + «Conectar Naturaleza», linking to `/`; section nav Fotos/Servicios/Opiniones/Ubicación; Compartir copies location.href. Footer (static .astro): horizonte svg, verde-900 band, `logo-white-transparent.png`, slogan «Desconectá de la rutina y conectá con eso que te hace bien.», Booking/Airbnb links, © year.
  - Photo grouping for contents.json gallery.spaces (files in src/assets/images): Exterior y entorno [portada.jpeg, exterior.jpg, exterior-2.jpeg, cielo-verde.jpg, juegos.jpg]; Playa y bajada al río [playa-2.jpg, bajada.jpeg, bajada-1.jpg, bajada-peatonal.jpeg]; Living y comedor [sala.jpeg, WhatsApp Image 2026-04-16 at 18.29.37.jpeg, tv.jpeg, WhatsApp Image 2026-04-16 at 18.29.36.jpeg]; Cocina [cocina.jpeg, IMG_1094.jpg, vajilla.jpg, amenities.jpg]; Dormitorio principal [hab-1.jpg, hab1-2.jpeg] beds 1× «2 plazas»; Segundo dormitorio [hab-2.jpg, WhatsApp Image 2026-04-16 at 18.29.38.jpeg] beds 1× «Cama marinera», 1× «1 plaza»; Baño [banio-1.jpg, banio-2.jpg, banio.jpeg, banio-3.jpeg]; Parrilla [parrilla.jpeg, parrilla-2.jpg]. Hero: portada, exterior, sala, hab-1, playa-2. whatsapp.png is unused after the port. Some files carry EXIF rotation; verify output orientation.
  - Content facts from the old site: capacity 5/6 (use max 6); A/A en las habitaciones; TV con Flow y Wifi; ropa de cama incluida (towels unknown → null); amenities (shampoo, crema de enjuague, jabón, aceite, sal, café, té); bajada a la playa a 50 m (lanchas y peatones); complejo privado «Mattes», máxima seguridad; espacios verdes y plaza de juegos; parrilla; cocina equipada. Location lat -27.5915042, lng -56.7093488, Ituzaingó, Corrientes, Argentina, a orillas del Río Paraná. WhatsApp +5493786414965. House rules unknown → items [] (section hidden). Testimonials from src/data/testimonials (Petter y amigos / Gloria y familia / Silvana y familia, rating 5, month null).
- L5 (evidence): `pnpm test` 3/3, `pnpm lint` exit 0, `pnpm build` OK (only warning: empty "internal" chunk). Headless Brave run: quote flow opens `https://wa.me/5493786414965?text=…` with Llegada/Salida/Noches/Huéspedes; gallery sheet, calendar and mobile layout checked by screenshot; EXIF orientation correct. Fixes during verification: React hydration error #418 caused by @playform/compress HTML minification (HTML compression turned off); `.astro` lint parse error caused by TypeScript 7 hoisted from admin (web now pins typescript 5.8.3 as devDependency). Slice note: 2 commits total ~6.2k changed lines (mostly deletions and copied UI); user decides PR slicing.
