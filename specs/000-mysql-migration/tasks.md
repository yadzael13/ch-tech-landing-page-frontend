# Tasks 000: Separación de repos (frontend)

- [x] Scaffolding: copiar `frontend/` del monorepo original a este repo, excluyendo `node_modules`/`.next`/`coverage`.
- [x] `.env.example` — reescribir `API_URL`/`NEXT_PUBLIC_API_URL` para apuntar a `localhost` en vez del hostname `backend` de Compose.
- [x] `.husky/pre-commit` — quitar el prefijo `frontend/`, correr `lint-staged` desde la raíz de este repo.
- [x] `package.json` — agregar `husky`/`prepare`, renombrar `name` a `ch-tech-landing-page-frontend`.
- [x] Docs: podar `ARCHITECTURE.md`/`DATABASE_*.md`/`DATA_MODEL.md` (quedan en el backend), recortar `DEPLOYMENT.md`/`CI_CD.md`/`TESTING.md`/`DOCKER.md`/`CONTRIBUTING.md` a su parte frontend.
- [x] ADRs: podar a las frontend-relevantes (0001, 0002, 0003, 0004, 0006).
- [x] `AI_GUIDELINES.md` — regla 14, sin credenciales de base de datos en este repo.
- [x] `CLAUDE.md` — punto de entrada para asistentes de IA.
- [x] `.github/workflows/{ci,security}.yml` — separados del monorepo, sin el job de backend.
- [x] `npm install` + `npm run test:coverage` en verde: 66 archivos de test, 163 tests, 89.47% de cobertura (mínimo requerido: 80%). Requirió Node 22 (el `package-lock.json` original, generado en Linux dentro de Docker, no resolvía bien el binding nativo `@rolldown/binding-win32-x64-msvc` en Windows hasta regenerarlo).
- [x] `git init` + commit inicial.
