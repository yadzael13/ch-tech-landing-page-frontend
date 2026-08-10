# Plan 001: Rediseño visual/UX nivel élite

## Enfoque técnico

Cinco fases secuenciales, cada una con checkpoint de aprobación antes de
tocar sus archivos. Detalle completo del razonamiento (investigación de
código real, alternativas consideradas) en
`C:\Users\hiram\.claude\plans\hazy-fluttering-river.md` — este archivo resume
lo accionable.

### Fase 0 — Fundamentos de diseño

Nuevos tokens en `app/globals.css` (`@theme`): `--color-surface-raised`,
`--color-surface-sunken`, `--color-border-strong`, `--color-scrim`,
`--color-danger`, `--color-danger-surface`, `--color-warning`,
`--shadow-elevated`, `--shadow-glow-accent`, y un registro `--animate-*`
(`fade-in-up`, `scale-in`, `shimmer`, `splash-exit`, `logo-pulse`,
`float-slow`) con sus `@keyframes`. El guard global de
`prefers-reduced-motion` ya existente los neutraliza automáticamente.

Nueva capa `components/ui/`: `Button` (colapsa el string de 50+ repeticiones
`focus-ring ... transition-[...] duration-200 ease-in-out ...`), `Card`
(`rounded-2xl border border-border bg-surface p-6`), `Field`/`Input`/
`Textarea` (reemplazan la constante `inputClass` redeclarada en 11 forms +
login, usan `useId()` para asociar label/error via `aria-describedby`/
`aria-invalid`), `Skeleton`/`SkeletonTable`/`SkeletonForm` (shimmer real +
`role="status"` oculto para lectores de pantalla), `Spinner`
(`animate-spin` nativo de Tailwind), `Dialog` (basado en `<dialog>` nativo,
reemplaza `window.confirm()`), `EmptyState`/`ErrorState` (canonizan los
`<p className="text-sm text-muted/text-red-400">` repetidos), `Reveal`
(wrapper `"use client"` de scroll-reveal, polimórfico via `as`).

Nuevos `lib/hooks/`: `useScrollReveal` (patrón "mounted gate": nunca oculta
contenido en SSR/primer render; si `IntersectionObserver` no existe, revela
de inmediato) y `usePrefersReducedMotion` (wrapper de `matchMedia`).

Prerrequisito de testing: stub de `IntersectionObserver` en
`vitest.setup.ts` (jsdom no lo implementa).

`components/layout/SplashScreen.tsx`: se monta solo en `app/page.tsx` (no en
`app/layout.tsx`, para no envolver `/admin`), gated por
`sessionStorage`, sin layout shift (`position: fixed`), duración mínima
acortada si `usePrefersReducedMotion()` es true.

### Fase 1 — Landing público

Hero se mantiene Server Component puro (animación de entrada directa, sin
`Reveal`). Las demás 8 secciones envuelven sus items en `<Reveal>` y migran
a `<Card>`/`<EmptyState>`/`<ErrorState>`. `Contact.tsx` migra a
`<Field>/<Input>/<Textarea>/<Button>` y gana `aria-invalid`/
`aria-describedby` real. `Navbar`/`Footer` migran botones a `<Button>`.

### Fase 2 — Admin: login, shell, home

Login gana `<Card>` + monograma de marca. `AdminShell` reemplaza
`"Cargando..."` por `<Spinner>`. Dashboard home migra a `<Card>`, sin
`<Reveal>` (el admin prioriza velocidad, no flourish).

### Fase 3 — 10 entidades CRUD admin

Patrón mecánico × 10 + singleton `company`: `inputClass` → `Field`/`Input`,
loading en blanco → `SkeletonTable`/`SkeletonForm`, `window.confirm()` →
`Dialog`. Los 10 `page.test.tsx` de listado (hoy
`vi.spyOn(window, "confirm")`) pasan a interactuar con el `Dialog` real, más
un caso nuevo de cancelar/Escape.

### Fase 4 — Pulido final

`app/not-found.tsx` y `app/loading.tsx`/`app/admin/(dashboard)/loading.tsx`
nuevos. Barrido final de `text-red-400` restante. `app/global-error.tsx` y
`app/icon.tsx` quedan con sus excepciones documentadas (no pueden depender
del árbol/CSS vars). QA final contra el checklist de
`.claude/skills/ui-ux-pro-max-skill/SKILL.md` en las 32 rutas.

## Riesgos aceptados

- **Spike de `<dialog>` nativo bajo jsdom+Vitest** (Fase 0, bloquea Fase 3) —
  **RESUELTO, spike falló**: jsdom 30.0.1 implementa `HTMLDialogElement` como
  un stub vacío (`class HTMLDialogElementImpl extends HTMLElement {}`, sin
  `showModal`/`close`), confirmado leyendo su fuente. Se aplicó el fallback
  documentado: `role="dialog" aria-modal="true"` hecho a mano +
  `lib/hooks/useFocusTrap.ts` nuevo (~55 líneas), sin dependencias nuevas.
  `Dialog.tsx` implementado y probado (7 tests) sobre esta base.
- **Pop-in del splash**: no se puede conocer `sessionStorage` en el server,
  así que hay una ventana (sub-frame en la práctica) donde la página real es
  visible antes de que el overlay aparezca. Aceptado como tradeoff frente a
  la alternativa más invasiva (script bloqueante inline en `<head>`); si el
  QA manual lo encuentra objetable, se escala entonces.
- **`--color-danger`/`--color-warning` son hex nuevos**, no parte del
  clonado original — se verifican por contraste AA (4.5:1) contra
  `--color-background`/`--color-surface` en la verificación de Fase 0/4.
