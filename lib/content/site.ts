/**
 * Placeholder copy sourced from docs/VISION.md. Kept separate from the
 * components that render it so it's trivial to replace with real content
 * later without touching any component logic.
 */

export const siteMeta = {
  name: "CH-TECH",
  author: "Yadzael Chalico",
  email: "contacto@ch-tech.dev",
};

// No production domain is hardcoded anywhere in the app — set
// NEXT_PUBLIC_SITE_URL to the real domain when deploying (.env.example).
// Used by lib/content/metadata.ts (metadataBase), app/robots.ts and
// app/sitemap.ts.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const navLinks = [
  { href: "#sobre-ch-tech", label: "Sobre CH-TECH" },
  { href: "#lineas-de-negocio", label: "Servicios" },
  { href: "#clientes", label: "Clientes" },
  { href: "#equipo", label: "Equipo" },
  { href: "#productos", label: "Productos" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#contacto", label: "Contacto" },
];

export const hero = {
  eyebrow: "Ingeniería de Software & IA",
  // Used only if GET /company fails — Hero prefers the live Company
  // tagline/mission so this copy never drifts from the admin-editable
  // source of truth (see components/sections/Hero.tsx).
  fallbackHeadline:
    "Construimos software moderno, automatizaciones con IA y productos digitales escalables.",
  fallbackSubtext:
    "Ayudamos a empresas a diseñar, desarrollar y desplegar productos de software con prácticas de ingeniería modernas — de la arquitectura al despliegue.",
  primaryCta: { href: "#proyectos", label: "Ver proyectos" },
  secondaryCta: { href: "#contacto", label: "Contactar" },
};

export const about = {
  title: "Sobre CH-TECH",
  // Used only if GET /company fails or has no vision set — About prefers
  // the live Company vision (see components/sections/About.tsx).
  fallbackIntro:
    "CH-TECH es una startup de Ingeniería de Software e Inteligencia Artificial. Diseñamos, desarrollamos e implementamos soluciones tecnológicas que ayudan a empresas a automatizar procesos, mejorar su operación y acelerar su crecimiento.",
  points: [
    {
      title: "Código mantenible",
      description:
        "Software legible, probado y preparado para crecer sin reescrituras.",
    },
    {
      title: "Seguridad por diseño",
      description:
        "Prácticas OWASP, autenticación robusta y validación en cada capa desde el primer commit.",
    },
    {
      title: "Arquitectura escalable",
      description:
        "Sistemas pensados para evolucionar sin fricciones, del primer cliente al primer millón de usuarios.",
    },
    {
      title: "Desarrollo asistido por IA",
      description:
        "Flujos de trabajo modernos que combinan criterio de ingeniería con herramientas de IA.",
    },
    {
      title: "Automatización completa",
      description:
        "CI/CD, pruebas y despliegues reproducibles mediante Docker desde el día uno.",
    },
    {
      title: "Documentación como fuente de verdad",
      description:
        "Decisiones registradas y trazables — el código y los documentos nunca divergen.",
    },
  ],
};

export const footer = {
  tagline:
    "Software moderno, automatizaciones con IA y productos digitales escalables.",
  socials: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
  ],
};
