# Deployment Strategy

> Este documento cubre el frontend. El despliegue del backend (EC2, RDS MySQL, Redis, Nginx, Cloudflare) vive en `ch-tech-landing-page-backend/docs/DEPLOYMENT.md`.

## Development

`npm run dev`, standalone (ver `.env.example` — no depende de Docker Compose ni de una red compartida con el backend).

## Production

Vercel — build y deploy automáticos vía la integración nativa de Vercel con GitHub (push a `main`).

`NEXT_PUBLIC_API_URL` / `API_URL` en producción apuntan al dominio real del backend (`ch-tech-landing-page-backend`, desplegado en EC2 — ver ese repo).

## Monitoring

Vercel Analytics / logs nativos de Vercel para el frontend. El monitoring de infraestructura (Uptime Kuma, Grafana, Prometheus) cubre el backend — ver `ch-tech-landing-page-backend/docs/DEPLOYMENT.md`.
