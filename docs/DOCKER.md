# Docker

> Este repositorio (frontend) corre standalone en desarrollo (`npm run dev`, ver `.env.example`) — ya no comparte `docker-compose.yml` con el backend. El `Dockerfile.dev`/`Dockerfile.prod` bajo `docker/frontend/` siguen existiendo para CI y para construir una imagen de referencia, pero no son el flujo de desarrollo local principal. El Docker-first policy completo (backend + base de datos) vive en `ch-tech-landing-page-backend/docs/DOCKER.md`.

## Objetivo

No se instalarán dependencias del proyecto directamente en el sistema operativo salvo Node.js/npm, necesarios para `npm run dev` standalone.

---

## Servicio

Next.js

Puerto 3000

---

## Comandos

Desarrollo

```bash
npm install
npm run dev
```

Build de la imagen de referencia (CI / Vercel-style)

```bash
docker build -f docker/frontend/Dockerfile.dev -t ch-tech-frontend:dev .
```
