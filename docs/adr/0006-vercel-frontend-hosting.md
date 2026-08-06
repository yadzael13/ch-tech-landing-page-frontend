# ADR-0006

## Título

Desplegar el frontend en Vercel.

## Estado

Aceptado

## Fecha

2026-08-01

---

## Contexto

CH-TECH necesita un destino de despliegue de producción para el frontend Next.js, con buen soporte para SSR/App Router, CDN global y bajo costo operativo para un proyecto personal.

---

## Decisión

El frontend se despliega en Vercel. El backend y la base de datos permanecen en Docker sobre un VPS Ubuntu (ver DEPLOYMENT.md).

---

## Alternativas

- Desplegar el frontend también en el VPS vía Docker (mayor control, sin CDN global, más mantenimiento).
- Netlify (soporte de Next.js App Router menos maduro al momento de decidir).

---

## Consecuencias

### Positivas

- Despliegues automáticos, preview por PR, CDN global sin configuración adicional.
- Next.js es mantenido por el mismo equipo que Vercel; compatibilidad garantizada.

### Negativas

- El frontend en producción no corre en Docker, lo que introduce un modelo de despliegue híbrido (ver ARCHITECTURA.md, sección Producción) — `docker/frontend/Dockerfile.prod` se mantiene únicamente para paridad de entorno en desarrollo/testing, no para producción.
- Comunicación frontend-backend cruza dominios (Vercel ↔ VPS), lo que requiere configuración explícita de CORS (ver SECURITY.md).

---

## Referencias

https://vercel.com/docs
