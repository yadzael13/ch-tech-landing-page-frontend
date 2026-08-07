"use client";

import { useEffect, useRef, useState } from "react";

interface UseActiveSectionOptions {
  threshold?: number;
  rootMargin?: string;
}

const DEFAULT_THRESHOLD = 0.35;
const DEFAULT_ROOT_MARGIN = "-20% 0px -20% 0px";

/**
 * Tracks which top-level <section> under #main-content currently dominates
 * the viewport, by DOM order. Unlike useScrollReveal (one-shot: it
 * disconnects on the first hit), this keeps a single IntersectionObserver
 * alive for the page's lifetime, since callers need the *current* dominant
 * section rather than a one-time reveal. Sections are matched by order, not
 * id, because not every section (e.g. Hero) has one.
 */
export function useActiveSection({
  threshold = DEFAULT_THRESHOLD,
  rootMargin = DEFAULT_ROOT_MARGIN,
}: UseActiveSectionOptions = {}): number {
  const [activeIndex, setActiveIndex] = useState(0);
  const intersectingRef = useRef<Set<Element>>(new Set());

  useEffect(() => {
    const root = document.getElementById("main-content");
    const sections = root
      ? Array.from(root.querySelectorAll(":scope > section"))
      : [];

    if (sections.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }

    const intersecting = intersectingRef.current;
    intersecting.clear();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.add(entry.target);
          } else {
            intersecting.delete(entry.target);
          }
        }

        const dominant = sections.findIndex((section) =>
          intersecting.has(section),
        );
        if (dominant !== -1) {
          setActiveIndex(dominant);
        }
      },
      { threshold, rootMargin },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return activeIndex;
}
