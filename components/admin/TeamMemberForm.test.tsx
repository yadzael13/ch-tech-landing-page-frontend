import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TeamMemberItem } from "@/lib/api/types";
import TeamMemberForm from "./TeamMemberForm";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const existingMember: TeamMemberItem = {
  id: "m1",
  user_id: null,
  name: "Yadzael Chalico",
  role: "Founder & Lead Software Engineer",
  bio: "Construye CH-TECH.",
  photo: null,
  linkedin_url: null,
  github_url: null,
  display_order: 0,
  active: false,
};

describe("TeamMemberForm", () => {
  it("submits the expected payload shape and redirects on success", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<TeamMemberForm onSubmit={onSubmit} submitLabel="Crear miembro" />);

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Ada Lovelace" },
    });
    fireEvent.change(screen.getByLabelText("Rol"), {
      target: { value: "Engineer" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear miembro" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Ada Lovelace",
        role: "Engineer",
        active: true,
        display_order: 0,
        user_id: null,
      }),
    );
    expect(pushMock).toHaveBeenCalledWith("/admin/team");
  });

  it("prefills fields from initialValue when editing", () => {
    render(
      <TeamMemberForm
        initialValue={existingMember}
        onSubmit={vi.fn()}
        submitLabel="Guardar cambios"
      />,
    );

    expect(screen.getByLabelText("Nombre")).toHaveValue("Yadzael Chalico");
    expect(screen.getByLabelText("Rol")).toHaveValue(
      "Founder & Lead Software Engineer",
    );
    expect(screen.getByLabelText("Activo")).not.toBeChecked();
  });

  it("shows an error message when onSubmit rejects", async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValue(new Error("El usuario referenciado no existe"));

    render(<TeamMemberForm onSubmit={onSubmit} submitLabel="Crear miembro" />);
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Ada Lovelace" },
    });
    fireEvent.change(screen.getByLabelText("Rol"), {
      target: { value: "Engineer" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear miembro" }));

    expect(
      await screen.findByText("El usuario referenciado no existe"),
    ).toBeInTheDocument();
  });
});
