"use client";

import { cloneElement, isValidElement, useId, type ReactElement } from "react";
import { cx } from "@/lib/cx";

interface ControlProps {
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

interface FieldProps {
  label: string;
  error?: string;
  className?: string;
  children: ReactElement<ControlProps>;
}

/**
 * Wraps a single Input/Textarea control with a label (implicit nesting, same
 * association pattern the codebase already used) and wires aria-invalid /
 * aria-describedby to the error text — the one part plain label-wrapping
 * never provided on its own.
 */
export function Field({ label, error, className, children }: FieldProps) {
  const errorId = useId();

  const control = isValidElement(children)
    ? cloneElement(children, {
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? errorId : undefined,
      })
    : children;

  return (
    // The error lives outside the <label>, not inside it: an implicit label
    // computes its control's accessible name from ALL of its text content,
    // so nesting the error here would concatenate it into the field's name
    // (e.g. "Email Formato inválido") instead of just describing it via
    // aria-describedby.
    <div className={cx("flex flex-col gap-1", className)}>
      <label className="flex flex-col gap-1 text-sm text-muted">
        {label}
        {control}
      </label>
      {error && (
        <span id={errorId} role="alert" className="text-xs text-danger">
          {error}
        </span>
      )}
    </div>
  );
}
