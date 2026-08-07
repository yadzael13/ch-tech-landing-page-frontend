import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useFocusTrap } from "./useFocusTrap";

function TrapProbe({ active }: { active: boolean }) {
  const ref = useFocusTrap<HTMLDivElement>(active);
  return (
    <div>
      <button type="button">Fuera</button>
      <div ref={ref}>
        <button type="button">Primero</button>
        <button type="button">Segundo</button>
      </div>
    </div>
  );
}

describe("useFocusTrap", () => {
  it("moves focus to the first focusable element when activated", () => {
    render(<TrapProbe active />);

    expect(screen.getByRole("button", { name: "Primero" })).toHaveFocus();
  });

  it("does nothing when inactive", () => {
    render(<TrapProbe active={false} />);

    expect(document.body).toHaveFocus();
  });

  it("wraps Tab from the last element back to the first", () => {
    render(<TrapProbe active />);

    const last = screen.getByRole("button", { name: "Segundo" });
    last.focus();

    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    last.dispatchEvent(event);

    expect(screen.getByRole("button", { name: "Primero" })).toHaveFocus();
  });

  it("wraps Shift+Tab from the first element back to the last", () => {
    render(<TrapProbe active />);

    const first = screen.getByRole("button", { name: "Primero" });
    first.focus();

    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    first.dispatchEvent(event);

    expect(screen.getByRole("button", { name: "Segundo" })).toHaveFocus();
  });

  it("restores focus to the previously focused element on deactivation", () => {
    const { rerender } = render(<TrapProbe active={false} />);

    const outside = screen.getByRole("button", { name: "Fuera" });
    outside.focus();
    expect(outside).toHaveFocus();

    rerender(<TrapProbe active />);
    expect(screen.getByRole("button", { name: "Primero" })).toHaveFocus();

    rerender(<TrapProbe active={false} />);
    expect(outside).toHaveFocus();
  });
});
