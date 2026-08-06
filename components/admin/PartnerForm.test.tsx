import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PartnerItem } from "@/lib/api/types";
import PartnerForm from "./PartnerForm";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const existingPartner: PartnerItem = {
  id: "p1",
  name: "AWS",
  logo: null,
  partnership_type: "Cloud",
  website_url: null,
};

describe("PartnerForm", () => {
  it("submits the expected payload shape and redirects on success", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<PartnerForm onSubmit={onSubmit} submitLabel="Crear partner" />);

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "AWS" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear partner" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "AWS",
        logo: null,
        partnership_type: null,
        website_url: null,
      }),
    );
    expect(pushMock).toHaveBeenCalledWith("/admin/partners");
  });

  it("prefills fields from initialValue when editing", () => {
    render(
      <PartnerForm
        initialValue={existingPartner}
        onSubmit={vi.fn()}
        submitLabel="Guardar cambios"
      />,
    );

    expect(screen.getByLabelText("Nombre")).toHaveValue("AWS");
    expect(screen.getByLabelText("Tipo de alianza")).toHaveValue("Cloud");
  });

  it("shows an error message when onSubmit rejects", async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValue(new Error("No fue posible guardar el partner."));

    render(<PartnerForm onSubmit={onSubmit} submitLabel="Crear partner" />);
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "AWS" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear partner" }));

    expect(
      await screen.findByText("No fue posible guardar el partner."),
    ).toBeInTheDocument();
  });
});
