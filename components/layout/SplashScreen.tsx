"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cx } from "@/lib/cx";

const SESSION_KEY = "ch-tech-splash-shown";
const MIN_DISPLAY_MS = 800;
const REDUCED_MOTION_DISPLAY_MS = 80;
const EXIT_DURATION_MS = 500;

function subscribe() {
  // Nothing external mutates sessionStorage for this key mid-session from
  // another source, so there's nothing to react to beyond the one read.
  return () => {};
}

function getSnapshot() {
  return sessionStorage.getItem(SESSION_KEY) === null;
}

function getServerSnapshot() {
  return false;
}

/**
 * Brand splash shown once per browser session, only on the public landing
 * page (mounted from app/page.tsx, not app/layout.tsx, so /admin is never
 * wrapped by it). useSyncExternalStore reports false during SSR and the
 * first client paint (matching output exactly, no hydration mismatch) and
 * only picks up the real sessionStorage value once mounted — the same
 * "mounted gate" guarantee as useScrollReveal, applied to browser storage
 * instead of IntersectionObserver.
 */
export function SplashScreen() {
  const notYetShown = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const shouldShow = notYetShown && !isDone;

  useEffect(() => {
    if (!shouldShow) return;

    containerRef.current?.focus();

    const displayMs = prefersReducedMotion
      ? REDUCED_MOTION_DISPLAY_MS
      : MIN_DISPLAY_MS;
    const timeout = setTimeout(() => setIsExiting(true), displayMs);

    return () => clearTimeout(timeout);
  }, [shouldShow, prefersReducedMotion]);

  useEffect(() => {
    if (!isExiting) return;

    const exitMs = prefersReducedMotion ? 0 : EXIT_DURATION_MS;
    const timeout = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setIsDone(true);
    }, exitMs);

    return () => clearTimeout(timeout);
  }, [isExiting, prefersReducedMotion]);

  if (!shouldShow) return null;

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className={cx(
        "fixed inset-0 z-[100] flex items-center justify-center bg-background",
        isExiting && "animate-splash-exit",
      )}
    >
      <div
        aria-hidden="true"
        className="flex h-16 w-16 animate-logo-pulse items-center justify-center rounded-xl bg-accent text-background"
      >
        <span className="font-[family-name:var(--font-display)] text-xl font-bold">
          CH
        </span>
      </div>
      <span role="status" className="sr-only">
        Cargando CH-TECH
      </span>
    </div>
  );
}
