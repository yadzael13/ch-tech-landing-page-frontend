import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TechnologyItem } from "@/lib/api/types";
import TechnologyForm from "./TechnologyForm";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const existingTechnology: TechnologyItem = {
  id: "t1",
  name: "Python",
  category: "Language",
  icon: null,
  official_url: "https://python.org",
};

describe("TechnologyForm", () => {
  it("submits the expected payload shape and redirects on success", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <TechnologyForm onSubmit={onSubmit} submitLabel="Crear tecnología" />,
    );

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Rust" },
    });
    fireEvent.change(screen.getByLabelText("Categoría"), {
      target: { value: "Language" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear tecnología" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Rust", category: "Language" }),
    );
    expect(pushMock).toHaveBeenCalledWith("/admin/technologies");
  });

  it("prefills fields from initialValue when editing", () => {
    render(
      <TechnologyForm
        initialValue={existingTechnology}
        onSubmit={vi.fn()}
        submitLabel="Guardar cambios"
      />,
    );

    expect(screen.getByLabelText("Nombre")).toHaveValue("Python");
    expect(screen.getByLabelText("Categoría")).toHaveValue("Language");
    expect(screen.getByLabelText("Sitio oficial")).toHaveValue(
      "https://python.org",
    );
  });

  it("shows an error message when onSubmit rejects", async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValue(new Error("Something went wrong"));

    render(
      <TechnologyForm onSubmit={onSubmit} submitLabel="Crear tecnología" />,
    );
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Go" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear tecnología" }));

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
  });
});
