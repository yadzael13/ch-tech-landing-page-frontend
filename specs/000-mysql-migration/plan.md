# Plan 000: Separación de repos (frontend)

## Enfoque técnico

Copia casi directa de `frontend/` del monorepo original — no se reescribe
Next.js/React/Tailwind ni la estructura de `app/`/`components/`/`lib/`. El
frontend ya estaba completamente aislado de la base de datos (todo pasa por
`lib/api/client.ts` contra el contrato HTTP del backend), así que la
migración de motor (Postgres → MySQL) en el backend no requiere ningún
cambio de código aquí.

Cambios reales:

1. `.env.example` — `API_URL`/`NEXT_PUBLIC_API_URL` pasan de
   `http://backend:8000` (hostname de Docker Compose compartido) a
   `http://localhost:8000` (el backend corre como proceso/contenedor
   independiente ahora).
2. `.husky/pre-commit` y `package.json` raíz — antes vivían en la raíz del
   monorepo con referencias a `frontend/`; se mueven a este repo y se les
   quita el prefijo de carpeta (`frontend/` deja de existir como subcarpeta,
   este repo *es* la raíz).
3. Documentación — se separan los docs backend-only (`ARCHITECTURE.md`,
   `DATABASE_*.md`, `DATA_MODEL.md`) y se recortan los compartidos
   (`DEPLOYMENT.md`, `CI_CD.md`, `TESTING.md`, `DOCKER.md`) a su parte
   frontend, apuntando al repo del backend para el resto.
4. `AI_GUIDELINES.md` — se agrega la regla explícita de que este repo nunca
   debe tener credenciales de base de datos.

## Riesgos aceptados

Ninguno específico de este repo — el riesgo real de la migración (tipos de
datos, privilegios, SQL específico de motor) vive enteramente en el backend.
