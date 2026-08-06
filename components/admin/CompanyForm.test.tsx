import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CompanyItem } from "@/lib/api/types";
import CompanyForm from "./CompanyForm";

const existingCompany: CompanyItem = {
  id: "co1",
  legal_name: "CH-TECH S.A. de C.V.",
  display_name: "CH-TECH",
  tagline: "Ingeniería de software e IA.",
  mission: "Automatizar procesos.",
  vision: "Crecer.",
  email: "hola@ch-tech.dev",
  phone: null,
  address: null,
  social_links: { linkedin: "https://linkedin.com/company/ch-tech" },
};

describe("CompanyForm", () => {
  it("submits the expected payload shape and shows a saved message", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <CompanyForm
        initialValue={null}
        onSubmit={onSubmit}
        submitLabel="Guardar cambios"
      />,
    );

    fireEvent.change(screen.getByLabelText("Razón social"), {
      target: { value: "CH-TECH S.A. de C.V." },
    });
    fireEvent.change(screen.getByLabelText("Nombre público"), {
      target: { value: "CH-TECH" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        legal_name: "CH-TECH S.A. de C.V.",
        display_name: "CH-TECH",
        social_links: null,
      }),
    );
    expect(await screen.findByText("Cambios guardados.")).toBeInTheDocument();
  });

  it("prefills fields from initialValue", () => {
    render(
      <CompanyForm
        initialValue={existingCompany}
        onSubmit={vi.fn()}
        submitLabel="Guardar cambios"
      />,
    );

    expect(screen.getByLabelText("Razón social")).toHaveValue(
      "CH-TECH S.A. de C.V.",
    );
    expect(screen.getByLabelText("Email")).toHaveValue("hola@ch-tech.dev");
    expect(screen.getByLabelText("Redes sociales (JSON)")).toHaveValue(
      JSON.stringify(
        { linkedin: "https://linkedin.com/company/ch-tech" },
        null,
        2,
      ),
    );
  });

  it("shows an error and does not submit when social_links is invalid JSON", async () => {
    const onSubmit = vi.fn();

    render(
      <CompanyForm
        initialValue={null}
        onSubmit={onSubmit}
        submitLabel="Guardar cambios"
      />,
    );

    fireEvent.change(screen.getByLabelText("Razón social"), {
      target: { value: "CH-TECH" },
    });
    fireEvent.change(screen.getByLabelText("Nombre público"), {
      target: { value: "CH-TECH" },
    });
    fireEvent.change(screen.getByLabelText("Redes sociales (JSON)"), {
      target: { value: "{not valid json" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(
      await screen.findByText(/Redes sociales debe ser JSON válido/),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows an error message when onSubmit rejects", async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValue(new Error("Correo electrónico inválido"));

    render(
      <CompanyForm
        initialValue={null}
        onSubmit={onSubmit}
        submitLabel="Guardar cambios"
      />,
    );

    fireEvent.change(screen.getByLabelText("Razón social"), {
      target: { value: "CH-TECH" },
    });
    fireEvent.change(screen.getByLabelText("Nombre público"), {
      target: { value: "CH-TECH" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(
      await screen.findByText("Correo electrónico inválido"),
    ).toBeInTheDocument();
  });
});
