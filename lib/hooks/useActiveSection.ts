"use client";

import { useEffect, useRef, useState } from "react";

interface UseActiveSectionOptions {
  threshold?: number;
  rootMargin?: string;
}

const DEFAULT_THRESHOLD = 0.35;
const DEFAULT_ROOT_MARGIN = "-20% 0px -20% 0px";

interface ActiveSection {
  /** Index (DOM order) of the section currently dominating the viewport. */
  activeIndex: number;
  /** Total top-level sections found under #main-content at mount. 0 before mount/on unsupported browsers. */
  sectionCount: number;
}

/**
 * Tracks which top-level <section> under #main-content currently dominates
 * the viewport, by DOM order. Unlike useScrollReveal (one-shot: it
 * disconnects on the first hit), this keeps a single IntersectionObserver
 * alive for the page's lifetime, since callers need the *current* dominant
 * section rather than a one-time reveal. Sections are matched by order, not
 * id, because not every section (e.g. Hero) has one.
 *
 * sectionCount is exposed alongside activeIndex so callers can tell "first"
 * and "last" section apart (e.g. CircuitBoard's load/contact energy peaks)
 * without hardcoding a section total that would drift if sections are added.
 */
export function useActiveSection({
  threshold = DEFAULT_THRESHOLD,
  rootMargin = DEFAULT_ROOT_MARGIN,
}: UseActiveSectionOptions = {}): ActiveSection {
  const [state, setState] = useState<ActiveSection>({
    activeIndex: 0,
    sectionCount: 0,
  });
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

    // sectionCount is set from inside this callback (an update from the
    // external IntersectionObserver, not a synchronous effect-body
    // setState) rather than eagerly in the effect — the browser reports
    // each observed target's initial intersection almost immediately after
    // observe() is called, so this costs no meaningful delay.
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

        setState((current) => ({
          activeIndex: dominant !== -1 ? dominant : current.activeIndex,
          sectionCount: sections.length,
        }));
      },
      { threshold, rootMargin },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return state;
}
