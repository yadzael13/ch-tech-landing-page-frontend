# Audience

Contributors

# Reglas

Siempre leer la documentación antes de escribir código.

No modificar archivos fuera del alcance de la tarea.

Una tarea por Pull Request.

Componentes pequeños.

TypeScript estricto.

Tailwind únicamente.

No instalar paquetes sin justificarlo.

Actualizar documentación cuando cambie la arquitectura.

Este repo corre standalone (`npm run dev`) — no requiere Docker para desarrollo local, aunque sí para CI/paridad de build (ver `docs/DOCKER.md`).

# Desarrollo guiado por especificaciones

Para cambios no triviales: crear `specs/NNN-nombre-feature/` con `spec.md` (qué/por qué), `plan.md` (cómo) y `tasks.md` (checklist ordenado). Ver `specs/000-mysql-migration/` como ejemplo real. Complementa, no reemplaza, el patrón de ADRs (`docs/adr/`) para decisiones cross-cutting.