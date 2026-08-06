import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ServiceItem } from "@/lib/api/types";
import ServiceForm from "./ServiceForm";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const existingService: ServiceItem = {
  id: "s1",
  slug: "consulting",
  title: "Consulting",
  description: "Asesoría técnica",
  featured: true,
  active: false,
};

describe("ServiceForm", () => {
  it("submits the expected payload shape and redirects on success", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<ServiceForm onSubmit={onSubmit} submitLabel="Crear servicio" />);

    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "Consulting" },
    });
    fireEvent.change(screen.getByLabelText("Slug"), {
      target: { value: "consulting" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear servicio" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Consulting",
        slug: "consulting",
        featured: false,
        active: true,
      }),
    );
    expect(pushMock).toHaveBeenCalledWith("/admin/services");
  });

  it("prefills fields from initialValue when editing", () => {
    render(
      <ServiceForm
        initialValue={existingService}
        onSubmit={vi.fn()}
        submitLabel="Guardar cambios"
      />,
    );

    expect(screen.getByLabelText("Título")).toHaveValue("Consulting");
    expect(screen.getByLabelText("Slug")).toHaveValue("consulting");
    expect(screen.getByLabelText("Destacado")).toBeChecked();
    expect(screen.getByLabelText("Activo")).not.toBeChecked();
  });

  it("shows an error message when onSubmit rejects", async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValue(new Error("A service with this slug already exists"));

    render(<ServiceForm onSubmit={onSubmit} submitLabel="Crear servicio" />);
    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "Dup" },
    });
    fireEvent.change(screen.getByLabelText("Slug"), {
      target: { value: "dup" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear servicio" }));

    expect(
      await screen.findByText("A service with this slug already exists"),
    ).toBeInTheDocument();
  });
});
