import type { TextareaHTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import {
  FORM_CONTROL_CLASS,
  FORM_CONTROL_INVALID_CLASS,
  isAriaInvalid,
} from "./formControlClasses";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...rest }: TextareaProps) {
  return (
    <textarea
      className={cx(
        FORM_CONTROL_CLASS,
        isAriaInvalid(rest["aria-invalid"]) && FORM_CONTROL_INVALID_CLASS,
        className,
      )}
      {...rest}
    />
  );
}
