# Tasks 001: Rediseño visual/UX nivel élite

## Fase 0 — Fundamentos de diseño

- [x] `git checkout -b feature/visual-redesign-elite`
- [x] Docs: `spec.md`/`plan.md`/`tasks.md` (este archivo)
- [x] `app/globals.css` — tokens nuevos (superficies, semánticos, sombras) +
      registro `--animate-*` + `@keyframes`
- [x] `vitest.setup.ts` — stub de `IntersectionObserver`
- [x] `lib/cx.ts` — helper de className (no estaba en el plan original, pero
      lo necesitan todos los primitives) + test
- [x] `lib/hooks/useScrollReveal.ts` + test — implementado con callback ref
      (no `RefObject`+`useEffect`) para evitar fricción de tipos con `as`
      polimórfico en `Reveal`
- [x] `lib/hooks/usePrefersReducedMotion.ts` + test — reescrito con
      `useSyncExternalStore` (no `useEffect`+`setState`) tras el error de
      lint `react-hooks/set-state-in-effect`
- [x] `components/ui/Button.tsx` + test (incluye variante `danger` para el
      confirm destructivo de `Dialog`)
- [x] `components/ui/Card.tsx` + test
- [x] `components/ui/Field.tsx` + test — el error vive _fuera_ del `<label>`
      (no adentro), si no el nombre accesible del control termina siendo
      "Email Formato inválido" en vez de solo "Email"
- [x] `components/ui/Input.tsx` + test
- [x] `components/ui/Textarea.tsx` + test
- [x] `components/ui/Skeleton.tsx` + test
- [x] `components/ui/SkeletonTable.tsx` + test
- [x] `components/ui/SkeletonForm.tsx` + test
- [x] `components/ui/Spinner.tsx` + test
- [x] `components/ui/Dialog.tsx` + test — **spike falló**: jsdom 30 no
      implementa `showModal()`/`close()` de `<dialog>` (stub vacío). Fallback
      aplicado: `role="dialog"` hecho a mano + `lib/hooks/useFocusTrap.ts`
      nuevo (no estaba en el plan original), sigue sin dependencias nuevas.
- [x] `components/ui/EmptyState.tsx` + test
- [x] `components/ui/ErrorState.tsx` + test
- [x] `components/ui/Reveal.tsx` + test
- [x] `components/layout/SplashScreen.tsx` + test — el gate de sessionStorage
      usa `useSyncExternalStore` (mismo motivo que `usePrefersReducedMotion`)
- [x] `app/page.tsx` — agregar `<SplashScreen />`
- [x] `npm run lint` en verde
- [x] `npm run test:coverage` ≥80% en verde (90.53% stmts / 84.17% branches /
      82.79% functions / 90.36% lines — 84 archivos, 227 tests)
- [x] Verificación manual (dev server, Node 22 vía Volta): splash una vez por
      sesión confirmado, 375px sin overflow horizontal, navegación funcional.
      `prefers-reduced-motion` verificado solo por test unitario (el
      navegador de esta sesión no expone emulación de esa media query).
- [x] Commit (`feat(design): add visual redesign foundation (tokens, ui
  primitives, splash)`, b2af3f0).

## Fase 1 — Landing público

- [x] Hero: animación de entrada directa (sin `Reveal`), stagger 80ms por
      elemento
- [x] About/TechStack/BusinessLines/Clients/Testimonials/Team/Products/Projects:
      `<Reveal>` + `<Card>`/`cardClassName` + `<EmptyState>`/`<ErrorState>`
      (de paso corrige el error de TechStack sin `role="alert"` y el hover
      faltante de Testimonials)
- [x] Contact: `<Field>/<Input>/<Textarea>/<Button>` + `aria-invalid`/
      `aria-describedby` real en el error de longitud del mensaje; mensaje
      de éxito/error animado con `starting:` (`@starting-style`)
- [x] Navbar: CTA migrado a `<Button>`, menú móvil animado
      (`animate-scale-in` al abrir, fade-out de 150ms antes de desmontar —
      mismo patrón de fases que `Dialog`) en vez de aparecer/desaparecer
      sin transición
- [x] Footer: revisado, sin cambios — sus links son texto plano sin
      tratamiento de botón, forzar `<Button>` habría cambiado su
      comportamiento visual en vez de solo consolidar markup
- [x] Verificación: lint limpio, 231/231 tests, cobertura 90.58%/84.47%/
      82.71%/90.39%. Verificación manual parcial — el splash/animaciones se
      confirmaron estructuralmente (clases correctas, sin overflow a
      375px, sin errores de consola) pero la interacción en vivo
      (`IntersectionObserver` real, clicks) no fue confiable en el entorno
      de este navegador automatizado (pane sin compositing de frames);
      la cobertura de tests unitarios cubre la lógica exacta.
- [x] Commit (`feat(landing): wire scroll-reveal and motion into the
  public landing page`, 47497e8).

## Fase 2 — Admin: login, shell, home

- [x] Login: `<Card>` con `shadow-elevated` + monograma "CH" (mismo motivo
      que `SplashScreen`), migrado a `Field`/`Input`/`Button`
- [x] `AdminShell`: `<Spinner>` en vez de "Cargando...", "Salir" migrado a
      `Button`
- [x] Dashboard home: las 11 link-cards comparten un `cardClassName`
      computado en vez de repetir el mismo string 11 veces (sin `<Reveal>`,
      deliberado — el admin prioriza velocidad sobre flourish de marketing)
- [x] Nuevo test en `AdminShell.test.tsx` — spinner visible mientras la
      sesión está en verificación (`role="status"`, vía `delay("infinite")`
      de MSW)
- [x] Verificación: lint limpio, 232/232 tests, cobertura 90.67%/84.47%/
      82.97%/90.48%. Sin verificación manual en navegador esta fase — el
      entorno de browser automatizado de esta sesión demostró ser poco
      fiable (ver nota de Fase 1); se confía en la cobertura de tests.
- [x] Commit (`feat(admin): polish login, shell chrome, and dashboard
    home`, 4ffc591).

## Fase 3 — 10 entidades CRUD admin (pendiente de checkpoint)

- [ ] Por entidad (Articles, CaseStudies, Clients, Company, Partners,
      Products, Projects, Services, Team, Technologies, Testimonials):
      `Field`/`Input` en el form, `SkeletonTable` en el listado,
      `SkeletonForm` en edit, `Dialog` en vez de `window.confirm()`
- [ ] Actualizar los 10 `page.test.tsx` de listado (`Dialog` real + caso de
      cancelar/Escape nuevo)
- [ ] `npm run lint`/`test:coverage` cada 2-3 entidades, no solo al final
- [ ] Verificación manual de al menos 2 entidades end-to-end + commit

## Fase 4 — Pulido final (pendiente de checkpoint)

- [ ] `app/not-found.tsx`
- [ ] `app/loading.tsx` + `app/admin/(dashboard)/loading.tsx`
- [ ] Barrido final de `text-red-400` restante
- [ ] QA contra `.claude/skills/ui-ux-pro-max-skill/SKILL.md` en las 32 rutas
- [ ] Contraste AA de `--color-danger`/`--color-warning`
- [ ] Verificación + commit final
