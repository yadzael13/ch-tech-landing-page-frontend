import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Dialog } from "./Dialog";

function renderDialog(
  props: Partial<React.ComponentProps<typeof Dialog>> = {},
) {
  const onClose = vi.fn();
  const onConfirm = vi.fn();

  const utils = render(
    <Dialog
      open
      title="¿Eliminar cliente?"
      description="Esta acción no se puede deshacer."
      confirmLabel="Eliminar"
      destructive
      onClose={onClose}
      onConfirm={onConfirm}
      {...props}
    />,
  );

  return { ...utils, onClose, onConfirm };
}

afterEach(() => {
  vi.useRealTimers();
  document.body.style.overflow = "";
});

describe("Dialog", () => {
  it("does not render when closed", () => {
    renderDialog({ open: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders as an accessible dialog with title and description", () => {
    renderDialog();

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("¿Eliminar cliente?")).toBeInTheDocument();
    expect(
      screen.getByText("Esta acción no se puede deshacer."),
    ).toBeInTheDocument();
  });

  it("moves focus into the dialog on open", () => {
    renderDialog();

    expect(screen.getByRole("button", { name: "Cancelar" })).toHaveFocus();
  });

  it("calls onConfirm when the confirm button is clicked", () => {
    const { onConfirm } = renderDialog();

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the cancel button is clicked", () => {
    const { onClose } = renderDialog();

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the backdrop is clicked", () => {
    const { onClose } = renderDialog();

    const dialog = screen.getByRole("dialog");
    fireEvent.click(dialog.previousSibling as Element);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", () => {
    const { onClose } = renderDialog();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("keeps rendering during the exit animation, then unmounts", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    const { rerender } = render(
      <Dialog
        open
        title="¿Eliminar cliente?"
        confirmLabel="Eliminar"
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    rerender(
      <Dialog
        open={false}
        title="¿Eliminar cliente?"
        confirmLabel="Eliminar"
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    // Still present immediately after open flips false — exit animation
    // plays before unmount.
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
