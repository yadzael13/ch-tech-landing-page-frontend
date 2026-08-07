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
- [ ] Commit (Conventional Commits, inglés) — pendiente de confirmación del
      usuario antes de commitear.

## Fase 2 — Landing público (pendiente de checkpoint)

- [ ] Hero: animación de entrada directa (sin `Reveal`)
- [ ] About/TechStack/BusinessLines/Clients/Testimonials/Team/Products/Projects:
      `<Reveal>` + `<Card>` + `<EmptyState>`/`<ErrorState>`
- [ ] Contact: `<Field>/<Input>/<Textarea>/<Button>` + `aria-invalid`/
      `aria-describedby` real
- [ ] Navbar/Footer: botones a `<Button>`
- [ ] Verificación + commit

## Fase 3 — Admin: login, shell, home (pendiente de checkpoint)

- [ ] Login: `<Card>` + monograma de marca
- [ ] `AdminShell`: `<Spinner>` en vez de "Cargando..."
- [ ] Dashboard home: `<Card>` (sin `<Reveal>`)
- [ ] Actualizar `AdminShell.test.tsx` (`getByRole('status')`)
- [ ] Verificación + commit

## Fase 4 — 10 entidades CRUD admin (pendiente de checkpoint)

- [ ] Por entidad (Articles, CaseStudies, Clients, Company, Partners,
      Products, Projects, Services, Team, Technologies, Testimonials):
      `Field`/`Input` en el form, `SkeletonTable` en el listado,
      `SkeletonForm` en edit, `Dialog` en vez de `window.confirm()`
- [ ] Actualizar los 10 `page.test.tsx` de listado (`Dialog` real + caso de
      cancelar/Escape nuevo)
- [ ] `npm run lint`/`test:coverage` cada 2-3 entidades, no solo al final
- [ ] Verificación manual de al menos 2 entidades end-to-end + commit

## Fase 5 — Pulido final (pendiente de checkpoint)

- [ ] `app/not-found.tsx`
- [ ] `app/loading.tsx` + `app/admin/(dashboard)/loading.tsx`
- [ ] Barrido final de `text-red-400` restante
- [ ] QA contra `.claude/skills/ui-ux-pro-max-skill/SKILL.md` en las 32 rutas
- [ ] Contraste AA de `--color-danger`/`--color-warning`
- [ ] Verificación + commit final
