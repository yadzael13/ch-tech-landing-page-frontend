# CLAUDE.md

Guía para Claude Code (o cualquier asistente de IA) trabajando en este repositorio — el frontend de CH-TECH, separado del monorepo original `ch-tech`.

## Antes de nada

Lee `docs/AI_GUIDELINES.md` — reglas de flujo de trabajo (branching, commits, alcance de cambios) que este repositorio espera de cualquier agente de IA.

## Regla no negociable: sin acceso a base de datos

Este repositorio nunca debe recibir credenciales de base de datos, un driver de MySQL, ni código que hable directo con la base de datos. Todo acceso a datos pasa exclusivamente por la API HTTP versionada del backend (`lib/api/client.ts`, contrato en `docs/API.md`). El backend (`ch-tech-landing-page-backend`) es quien aplica el aislamiento real a nivel de motor (`chtech_app` sin privilegios DDL) — ver su ADR-0014.

## Stack y arquitectura

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4. `app/` compone las secciones públicas del landing y el panel `/admin` (CRUD de 11 entidades). `lib/api/client.ts` es el único punto de contacto con el backend — nunca hacer `fetch` directo a una URL de backend fuera de esa capa. Auth: token de acceso en memoria (`lib/auth/AuthContext.tsx`), refresh vía cookie httpOnly.

## Desarrollo guiado por especificaciones (spec-driven)

Para cambios no triviales, antes de escribir código: crear `specs/NNN-nombre-feature/` con `spec.md` (qué y por qué), `plan.md` (cómo) y `tasks.md` (checklist ordenado). Ver `specs/000-mysql-migration/` como ejemplo real. Se apoya en el Plan Mode nativo de Claude Code, sin herramientas adicionales.

## Comandos frecuentes

```bash
npm install
npm run dev              # standalone, apunta a NEXT_PUBLIC_API_URL (ver .env.example)
npm run test:coverage
npm run lint
```

## Repositorio hermano

El backend vive en `../ch-tech-landing-page-backend`, repo independiente. Este frontend nunca comparte red de Docker ni base de datos con él — la única superficie de contacto es la API HTTP versionada.
