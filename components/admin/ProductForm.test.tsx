import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductItem } from "@/lib/api/types";
import ProductForm from "./ProductForm";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const existingProduct: ProductItem = {
  id: "pr1",
  slug: "ch-tech-cloud",
  name: "CH-TECH Cloud",
  short_description: "SaaS de automatización",
  full_description: null,
  status: "BETA",
  url: null,
  logo: null,
  featured: true,
};

describe("ProductForm", () => {
  it("submits the expected payload shape and redirects on success", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<ProductForm onSubmit={onSubmit} submitLabel="Crear producto" />);

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "CH-TECH Cloud" },
    });
    fireEvent.change(screen.getByLabelText("Slug"), {
      target: { value: "ch-tech-cloud" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear producto" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "CH-TECH Cloud",
        slug: "ch-tech-cloud",
        status: "WAITLIST",
        featured: false,
      }),
    );
    expect(pushMock).toHaveBeenCalledWith("/admin/products");
  });

  it("prefills fields from initialValue when editing", () => {
    render(
      <ProductForm
        initialValue={existingProduct}
        onSubmit={vi.fn()}
        submitLabel="Guardar cambios"
      />,
    );

    expect(screen.getByLabelText("Nombre")).toHaveValue("CH-TECH Cloud");
    expect(screen.getByLabelText("Slug")).toHaveValue("ch-tech-cloud");
    expect(screen.getByLabelText("Estado")).toHaveValue("BETA");
    expect(screen.getByLabelText("Destacado")).toBeChecked();
  });

  it("shows an error message when onSubmit rejects", async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValue(new Error("A product with this slug already exists"));

    render(<ProductForm onSubmit={onSubmit} submitLabel="Crear producto" />);
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Dup" },
    });
    fireEvent.change(screen.getByLabelText("Slug"), {
      target: { value: "dup" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear producto" }));

    expect(
      await screen.findByText("A product with this slug already exists"),
    ).toBeInTheDocument();
  });
});
