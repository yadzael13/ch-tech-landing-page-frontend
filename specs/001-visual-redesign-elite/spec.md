# Spec 001: Rediseño visual/UX nivel élite

## Qué

Elevar la calidad visual/UX de las 32 pantallas del frontend (landing público
de 10 secciones + panel admin: login, shell, home y 11 entidades CRUD) sin
cambiar contratos de datos, rutas, ni funcionalidad. Es una elevación de
ejecución, no un rediseño desde cero: se extiende la identidad visual ya
existente (paleta teal/mint sobre fondo casi negro, tipografía Sora+Inter, la
convención de tokens `@theme` de Tailwind 4), no se reemplaza.

Incluye: sistema de tokens de diseño ampliado (superficies elevadas/hundidas,
colores semánticos de estado), una capa de componentes compartidos
(`components/ui/`) que colapsa la duplicación de clases Tailwind repetidas a
mano en cada archivo, animaciones CSS (scroll-reveal, transiciones,
micro-interacciones), un splash de marca en la primera carga del landing
público, y skeletons/spinners reales reemplazando el texto plano
"Cargando..." en todo el panel admin.

## Por qué

El frontend funciona correctamente pero su ejecución visual es plana: cero
animaciones, cero componentes compartidos (cada botón/card/input se repite a
mano por archivo), cero loading real (los listados admin no muestran nada
mientras cargan), y `window.confirm()` nativo para toda acción destructiva.
El objetivo es que el sitio se perciba al nivel de una página de agencia de
software de élite, sin tocar la arquitectura de datos ni el backend.

## Requisitos

1. La paleta y tipografía existentes se **extienden**, nunca se reemplazan —
   los 7 tokens de color y los 2 tokens de fuente actuales en `app/globals.css`
   quedan intactos.
2. Cero dependencias npm nuevas — animaciones vía CSS puro (`@keyframes` +
   Tailwind `transition-*`) y un hook propio con `IntersectionObserver` para
   scroll-reveal. Confirmación de borrado vía `<dialog>` nativo, no una
   librería headless.
3. Cobertura de tests (`npm run test:coverage`) se mantiene ≥80% en todo
   momento — los tests rotos por cambios de markup (ver `plan.md`) se
   actualizan como parte de la misma fase que rompe.
4. Todo contenido debe seguir siendo visible sin JavaScript o con
   `prefers-reduced-motion: reduce` activo — ninguna animación puede ocultar
   contenido permanentemente (patrón "mounted gate": visible por defecto,
   la animación es una mejora, nunca un gate).
5. El backend (`ch-tech-landing-page-backend`) no se modifica — cambio
   puramente frontend, sin impacto en contratos de API.
6. Rollout en 5 fases con checkpoint de aprobación entre cada una (ver
   `plan.md`): Fase 0 (fundamentos) → Fase 1 (landing público) → Fase 2
   (admin: login/shell/home) → Fase 3 (10 entidades CRUD) → Fase 4 (pulido
   final).

## Criterios de aceptación

### Fase 0 — Fundamentos

- [ ] `app/globals.css` tiene los tokens nuevos (superficies, estados
      semánticos, sombras, registro de animaciones) sin alterar los 7 tokens
      de color originales.
- [ ] `components/ui/` existe con Button, Card, Field, Input, Textarea,
      Skeleton, SkeletonTable, SkeletonForm, Spinner, Dialog, EmptyState,
      ErrorState, Reveal — cada uno con su test co-localizado.
- [ ] `lib/hooks/useScrollReveal.ts` y `usePrefersReducedMotion.ts` existen,
      con tests, y el patrón "mounted gate" está verificado (SSR/primer
      pintado = contenido visible, sin mismatch de hidratación).
- [ ] `components/layout/SplashScreen.tsx` se muestra una vez por sesión en
      `/`, no re-aparece en un refresh de la misma pestaña, no envuelve
      `/admin`.
- [ ] El spike de `Dialog` (native `<dialog>` bajo jsdom+Vitest) está
      resuelto — `showModal()`/`close()`/evento `cancel` funcionan en tests,
      o se documenta el fallback manual antes de la Fase 3.
- [ ] `npm run lint` y `npm run test:coverage` (≥80%) en verde.

### Fases 1–4

Ver detalle y criterios específicos en `plan.md` — se confirman fase por
fase a medida que cada una se aprueba e implementa.
