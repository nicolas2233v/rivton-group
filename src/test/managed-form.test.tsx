import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { PublishedContext } from "@/platform/content-context";
import type { PublicSnapshot } from "@/platform/public-content";
import { formSchema } from "@/platform/contracts";
import { ManagedForm } from "@/platform/managed-form";
import { approvedFields } from "@/platform/form-presentation";
const { submit, track } = vi.hoisted(() => ({ submit: vi.fn(), track: vi.fn() }));
vi.mock("@/platform/forms", () => ({ submitForm: submit }));
vi.mock("@/platform/measurement", () => ({ track }));
const fields = [
  { name: "nombre", label: "Nombre y apellido", required: true },
  { name: "email", label: "Email", type: "email" as const, required: true },
  { name: "telefono", label: "Teléfono", type: "tel" as const },
  { name: "mensaje", label: "Mensaje", type: "textarea" as const, required: true },
];
function view(active = true) {
  const form = formSchema.parse({
    name: "Contacto",
    active,
    fields: [
      ...approvedFields(fields),
      {
        id: "consent",
        label: "Acepto la política de privacidad",
        type: "consent",
        required: true,
        help: "",
        options: [],
      },
    ],
    storeLead: true,
    whatsapp: true,
    emailEnabled: false,
    recipient: "",
    privacyApproved: true,
    privacyRevision: "approved:2",
    successMessage: "Podés continuar por WhatsApp.",
  });
  const cms = {
    configuration: { whatsapp: "5493513437509" },
    catalogs: [],
    forms: active ? { contacto: form } : {},
    formIds: { contacto: "11111111-1111-4111-8111-111111111111" },
  } as unknown as PublicSnapshot;
  return render(
    <PublishedContext.Provider value={cms}>
      <ManagedForm
        slug="contacto"
        fields={fields}
        submitLabel="Enviar consulta"
        defaults={{ mensaje: "Consulta por: Casa real" }}
      />
    </PublishedContext.Provider>,
  );
}
beforeEach(() => {
  cleanup();
  submit.mockReset();
  track.mockReset();
});
describe("approved contact form with real submission contract", () => {
  it("preserves approved fields and CTA even before activation, without allowing storage", () => {
    view(false);
    expect(screen.getByLabelText("Mensaje *")).toHaveValue("Consulta por: Casa real");
    expect(screen.getByRole("button", { name: "Enviar consulta" })).toBeDisabled();
    expect(screen.getByRole("link", { name: "escribinos por WhatsApp" })).toHaveAttribute(
      "href",
      "https://wa.me/5493513437509",
    );
    expect(submit).not.toHaveBeenCalled();
  });
  it("validates required fields and explicit consent before the transport", () => {
    view();
    fireEvent.click(screen.getByRole("button", { name: "Enviar consulta" }));
    expect(screen.getAllByText("Campo obligatorio")).toHaveLength(2);
    expect(screen.getByText("Aceptá la política de privacidad para continuar.")).toBeVisible();
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/Nombre y apellido/)).toHaveFocus();
  });
  it("sends mapped defaults, keeps retry identity, and confirms only persisted leads", async () => {
    submit
      .mockRejectedValueOnce(new Error("Error de red"))
      .mockResolvedValueOnce({
        stored: true,
        duplicate: false,
        message: "Podés continuar por WhatsApp.",
        whatsapp: "https://wa.me/5493513437509?text=consulta",
        emailSent: false,
      });
    view();
    fireEvent.change(screen.getByLabelText(/Nombre y apellido/), {
      target: { value: "Prueba local" },
    });
    fireEvent.change(screen.getByLabelText("Email *"), { target: { value: "test@example.test" } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Enviar consulta" }));
    await screen.findByText("Error de red");
    fireEvent.click(screen.getByRole("button", { name: "Enviar consulta" }));
    await screen.findByText(/Recibimos tu consulta/);
    expect(submit).toHaveBeenCalledTimes(2);
    expect(submit.mock.calls[0]![0].data.key).toMatch(/^[a-f0-9-]{36}$/);
    expect(submit.mock.calls[0]![0].data.key).toBe(submit.mock.calls[1]![0].data.key);
    expect(submit.mock.calls[1]![0].data.answers.message).toBe("Consulta por: Casa real");
    expect(screen.getByRole("link", { name: "Continuar por WhatsApp" })).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/"),
    );
    expect(track).toHaveBeenCalledWith("generate_lead", expect.any(Object), expect.any(String));
    fireEvent.change(screen.getByLabelText("Mensaje *"), { target: { value: "Otra consulta" } });
    expect(screen.getByRole("button", { name: "Enviar consulta" })).toBeEnabled();
    expect(screen.queryByText(/Recibimos tu consulta/)).toBeNull();
  });
});
