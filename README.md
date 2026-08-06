# CH-TECH Landing Page — Frontend

> Sitio oficial de CH-TECH, startup de Ingeniería de Software e Inteligencia Artificial.

Este repositorio es el frontend, separado de [`ch-tech-landing-page-backend`](../ch-tech-landing-page-backend) dentro del ecosistema `ch-tech-ecosystem`. Migrado desde el monorepo original `ch-tech`. Nunca accede a la base de datos directamente — todo pasa por la API HTTP versionada del backend (`docs/API.md`).

CH-TECH diseña, desarrolla e implementa soluciones tecnológicas que ayudan a empresas a automatizar procesos, mejorar su operación y acelerar su crecimiento mediante software e IA. Este repositorio construye esa plataforma siguiendo buenas prácticas de ingeniería de software modernas, incluyendo:

- Desarrollo asistido por IA (Claude Code)
- CI/CD
- Security by Design
- Documentación como fuente de verdad

Ver docs/VISION.md para la misión, visión y modelo de negocio completos.

---

# Objetivos

- Presentar a CH-TECH y sus cinco líneas de negocio (Software Engineering, AI & Automation, Digital Solutions, SaaS Products, Technology Consulting).
- Publicar proyectos, casos de estudio y, a futuro, productos SaaS propios.
- Generar leads mediante el formulario de contacto.
- Servir como plantilla para futuros proyectos del equipo.

---

# Stack Tecnológico

- Next.js (App Router)
- React
- TypeScript
- TailwindCSS
- Vitest + React Testing Library + MSW

Ver `docs/TECH_STACK.md` para la vista completa del ecosistema (incluye el backend).

---

# Estructura

```
app/                  rutas públicas del landing + panel /admin
components/            layout, secciones públicas, formularios admin
lib/                    api/, auth/, content/ — único punto de contacto con el backend
docs/                   documentación técnica + ADRs
specs/                  especificaciones spec-driven (spec/plan/tasks por feature)
docker/                 Dockerfile de referencia (CI / build de paridad)
.github/                CI/CD
```

---

# Desarrollo

```bash
npm install
npm run dev
```

Requiere el backend corriendo por separado (`ch-tech-landing-page-backend`, ver ese repo) y `NEXT_PUBLIC_API_URL`/`API_URL` apuntando a él (ver `.env.example`). No comparten red de Docker ni base de datos.

---

# Documentación

Toda la documentación vive en la carpeta `docs`.

Antes de implementar una nueva funcionalidad se debe revisar la documentación correspondiente.

---

# Roadmap

Consultar:

docs/ROADMAP.md

---

## License

This project is licensed under the MIT License.
See the LICENSE file for details.