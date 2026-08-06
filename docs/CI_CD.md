# CI/CD

> Este documento cubre el frontend (`.github/workflows/ci.yml` de este repo). El pipeline del backend vive en `ch-tech-landing-page-backend/docs/CI_CD.md`.

## Objetivo

Garantizar que ningún cambio llegue a main sin cumplir los estándares de calidad.

---

## Pipeline

Cada Pull Request ejecutará automáticamente:

- Lint (ESLint)
- Format check (Prettier)
- Tests (Vitest)
- Coverage
- Build Docker
- Security Scan (npm audit, Trivy)

Vercel además construye y despliega un preview por cada PR de forma automática (integración nativa, fuera de este workflow).

---

## Merge Policy

No se permite hacer merge si falla alguno de los siguientes:

- lint
- tests
- cobertura mínima
- build
- análisis estático

---

## Cobertura mínima

80% (`npm run test:coverage`)

---

## Ramas protegidas

main

develop

No se permite hacer push directo.
