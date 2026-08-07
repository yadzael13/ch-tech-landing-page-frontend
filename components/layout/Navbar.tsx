"use client";

import { useEffect, useRef, useState } from "react";
import { hero, navLinks, siteMeta } from "@/lib/content/site";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/cx";

const MENU_EXIT_DURATION_MS = 150;

type MenuPhase = "closed" | "open" | "closing";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [phase, setPhase] = useState<MenuPhase>("closed");
  // Derives phase from isMenuOpen during render (same pattern as
  // Dialog.tsx) rather than an effect, so a click is never a render behind.
  const [prevMenuOpen, setPrevMenuOpen] = useState(isMenuOpen);
  if (isMenuOpen !== prevMenuOpen) {
    setPrevMenuOpen(isMenuOpen);
    setPhase(isMenuOpen ? "open" : "closing");
  }

  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (phase !== "closing") return;
    const timeout = setTimeout(() => setPhase("closed"), MENU_EXIT_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [phase]);

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

  const isMenuRendered = phase !== "closed";
  const isMenuClosing = phase === "closing";

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
          <Button href={hero.secondaryCta.href} size="sm">
            {hero.secondaryCta.label}
          </Button>
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

      {isMenuRendered && (
        <ul
          id="mobile-menu"
          className={cx(
            "mx-auto flex max-w-6xl origin-top flex-col gap-4 rounded-2xl border border-border bg-surface/95 px-6 py-4 mt-2 backdrop-blur-md md:hidden",
            isMenuClosing
              ? "opacity-0 transition-opacity duration-150"
              : "animate-scale-in",
          )}
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
