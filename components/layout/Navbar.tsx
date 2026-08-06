"use client";

import { useEffect, useRef, useState } from "react";
import { hero, navLinks, siteMeta } from "@/lib/content/site";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    firstLinkRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 md:px-6">
      <nav
        aria-label="Principal"
        className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-border bg-surface/80 px-6 py-3 backdrop-blur-md"
      >
        <a
          href="#top"
          className="focus-ring rounded-full text-lg font-semibold tracking-tight transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:text-accent"
        >
          {siteMeta.name}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="focus-ring rounded-full text-sm text-muted transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
            <span
              aria-hidden="true"
              className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent"
            />
            {hero.eyebrow}
          </span>
          <a
            href={hero.secondaryCta.href}
            className="focus-ring rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:shadow-[0_0_24px_-6px_var(--color-accent)] active:scale-[0.98]"
          >
            {hero.secondaryCta.label}
          </a>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="focus-ring rounded-full p-1 text-sm transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:text-accent active:scale-[0.96] md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? "Cerrar" : "Menú"}
        </button>
      </nav>

      {isMenuOpen && (
        <ul
          id="mobile-menu"
          className="mx-auto flex max-w-6xl flex-col gap-4 rounded-2xl border border-border bg-surface/95 px-6 py-4 mt-2 backdrop-blur-md md:hidden"
        >
          {navLinks.map((link, index) => (
            <li key={link.href}>
              <a
                ref={index === 0 ? firstLinkRef : undefined}
                href={link.href}
                className="focus-ring rounded-full text-sm text-muted transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:text-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
