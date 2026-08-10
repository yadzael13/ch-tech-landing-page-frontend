import type { InputHTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import {
  FORM_CONTROL_CLASS,
  FORM_CONTROL_INVALID_CLASS,
  isAriaInvalid,
} from "./formControlClasses";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...rest }: InputProps) {
  return (
    <input
      className={cx(
        FORM_CONTROL_CLASS,
        isAriaInvalid(rest["aria-invalid"]) && FORM_CONTROL_INVALID_CLASS,
        className,
      )}
      {...rest}
    />
  );
}
