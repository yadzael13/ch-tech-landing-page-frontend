export const FORM_CONTROL_CLASS =
  "focus-ring w-full rounded-lg border border-border bg-surface px-4 py-2 text-foreground transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent/60";

export const FORM_CONTROL_INVALID_CLASS = "border-danger";

export function isAriaInvalid(value: boolean | "true" | "false" | undefined) {
  return value === true || value === "true";
}
