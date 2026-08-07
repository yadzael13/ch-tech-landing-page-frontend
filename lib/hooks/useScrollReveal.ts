"use client";

import { useCallback, useRef, useState } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

interface UseScrollRevealResult<T extends HTMLElement> {
  ref: (node: T | null) => void;
  isVisible: boolean;
}

/**
 * "Mounted gate" pattern: the first client render (matching SSR output
 * exactly, so no hydration mismatch) always reports visible. Hiding only
 * ever happens once the element actually mounts (via this callback ref) —
 * so a visitor without JS, or a crawler that doesn't execute it, always
 * sees full content. The reveal is a pure enhancement, never a gate.
 *
 * A callback ref (rather than a RefObject from useEffect) is used
 * deliberately: it fires exactly when the node attaches/detaches, and its
 * function type stays assignable to any HTMLElement subtype's `ref` prop
 * (div, li, article, ...) without generic/ref-covariance friction.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: UseScrollRevealOptions = {},
): UseScrollRevealResult<T> {
  const { threshold = 0.15, rootMargin = "0px" } = options;
  const [isVisible, setIsVisible] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: T | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (!node || typeof IntersectionObserver === "undefined") {
        setIsVisible(true);
        return;
      }

      setIsVisible(false);

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold, rootMargin },
      );

      observer.observe(node);
      observerRef.current = observer;
    },
    [threshold, rootMargin],
  );

  return { ref, isVisible };
}
