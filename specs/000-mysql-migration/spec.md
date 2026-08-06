# Spec 000: Separación de repos (frontend)

## Qué

Separar el frontend del monorepo original `ch-tech` en su propio
repositorio (`ch-tech-landing-page-frontend`), sin cambios de código
sustanciales: el frontend nunca tocó la base de datos directamente, así que
la migración de PostgreSQL a MySQL (ver el mismo spec en
`ch-tech-landing-page-backend`) no le afecta más allá de cómo se conecta al
backend en desarrollo local.

## Por qué

El proyecto pasa de un monorepo (`frontend/` + `backend/`) a un ecosistema
de repos independientes, reflejando que ambas apps ya se desplegaban por
separado (Vercel vs. EC2/Docker Compose).

## Requisitos

1. El sitio público y el panel de administración deben funcionar
   exactamente igual que antes — mismo diseño, mismos flujos.
2. El frontend no debe depender de que el backend viva en el mismo
   `docker-compose.yml` (dejaron de compartir red de Compose).
3. El frontend nunca debe tener credenciales de base de datos ni un driver
   de MySQL (ver `docs/AI_GUIDELINES.md`, regla 14).
4. El repositorio original (`ch-tech`) no se modifica ni se borra.

## Criterios de aceptación

- [x] `npm run dev` levanta el sitio standalone, sin Docker Compose.
- [x] `.env.example` documenta `NEXT_PUBLIC_API_URL`/`API_URL` apuntando a `localhost` en vez de al hostname `backend` de Compose.
- [x] `npm run test:coverage` (Vitest + RTL + MSW) sigue en verde — MSW mockea el contrato HTTP, no la base de datos, así que no le afecta el motor del backend.
- [x] `.husky/pre-commit` y el `package.json` raíz (antes en la raíz del monorepo) funcionan dentro de este repo sin el prefijo `frontend/`.
