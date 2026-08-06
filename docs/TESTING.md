# Testing Strategy

> Este documento cubre el frontend. La estrategia de testing del backend (TDD obligatorio, cobertura 90%) vive en `ch-tech-landing-page-backend/docs/TESTING.md`.

Componentes críticos

- pruebas unitarias (Vitest + React Testing Library)

Flujos importantes

- pruebas de integración (MSW mockea el contrato HTTP del backend — ver `test/msw-server.ts`)

Landing

- pruebas visuales cuando sea posible

Cobertura mínima: 80% (`npm run test:coverage`).
