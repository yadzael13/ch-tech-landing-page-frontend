"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { Button } from "./Button";

const EXIT_DURATION_MS = 150;

type Phase = "closed" | "open" | "closing";

interface DialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Hand-rolled role="dialog" modal, replacing window.confirm(). The native
 * <dialog> element was the original design (top-layer stacking,
 * ::backdrop, free focus containment) — dropped after a spike showed
 * jsdom 30's HTMLDialogElement is an unimplemented stub (no
 * showModal()/close()), which made it untestable under this project's
 * Vitest stack. useFocusTrap replaces the native focus containment; still
 * zero new dependencies.
 */
export function Dialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancelar",
  destructive = false,
  onConfirm,
  onClose,
}: DialogProps) {
  const [phase, setPhase] = useState<Phase>(open ? "open" : "closed");
  // Derives phase from the `open` prop during render (React's documented
  // "adjusting state when a prop changes" pattern) instead of an effect —
  // avoids the extra render-then-effect round trip an effect would add.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    setPhase(open ? "open" : "closing");
  }

  const titleId = useId();
  const isRendered = phase !== "closed";
  const isClosing = phase === "closing";
  const containerRef = useFocusTrap<HTMLDivElement>(isRendered && !isClosing);

  useEffect(() => {
    if (phase !== "closing") return;

    const timeout = setTimeout(() => setPhase("closed"), EXIT_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    if (!isRendered) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isRendered, onClose]);

  if (!isRendered) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cx(
          "absolute inset-0 bg-[var(--color-scrim)]",
          isClosing
            ? "opacity-0 transition-opacity duration-150"
            : "animate-fade-in-up",
        )}
      />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx(
          "focus-ring relative w-full max-w-sm rounded-2xl border border-border bg-surface-raised p-6 text-foreground shadow-[var(--shadow-elevated)]",
          isClosing
            ? "opacity-0 transition-opacity duration-150"
            : "animate-scale-in",
        )}
      >
        <h2
          id={titleId}
          className="font-[family-name:var(--font-display)] text-lg font-bold"
        >
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-muted">{description}</p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? "danger" : "primary"}
            size="sm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
