import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ClientItem } from "@/lib/api/types";
import ClientForm from "./ClientForm";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const existingClient: ClientItem = {
  id: "c1",
  name: "Acme Corp",
  logo: null,
  industry: "Retail",
  website_url: null,
};

describe("ClientForm", () => {
  it("submits the expected payload shape and redirects on success", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<ClientForm onSubmit={onSubmit} submitLabel="Crear cliente" />);

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Acme Corp" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear cliente" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Acme Corp",
        logo: null,
        industry: null,
        website_url: null,
      }),
    );
    expect(pushMock).toHaveBeenCalledWith("/admin/clients");
  });

  it("prefills fields from initialValue when editing", () => {
    render(
      <ClientForm
        initialValue={existingClient}
        onSubmit={vi.fn()}
        submitLabel="Guardar cambios"
      />,
    );

    expect(screen.getByLabelText("Nombre")).toHaveValue("Acme Corp");
    expect(screen.getByLabelText("Industria")).toHaveValue("Retail");
  });

  it("shows an error message when onSubmit rejects", async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValue(new Error("No fue posible guardar el cliente."));

    render(<ClientForm onSubmit={onSubmit} submitLabel="Crear cliente" />);
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Acme Corp" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear cliente" }));

    expect(
      await screen.findByText("No fue posible guardar el cliente."),
    ).toBeInTheDocument();
  });
});
