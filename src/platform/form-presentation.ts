import type { Field } from "@/components/lead-form";
import type { z } from "@/lib/validation";
import type { formSchema } from "./contracts";

export type FormField = z.infer<typeof formSchema>["fields"][number];
const aliases: Record<string, string> = {
  nombre: "name",
  telefono: "phone",
  mensaje: "message",
  tipo: "property_type",
  operacion: "operation",
  ubicacion: "location",
};
export function initialFormValues(defaults: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => [aliases[key] ?? key, value]),
  );
}
export function approvedFields(fields: Field[]): FormField[] {
  return fields.map((field) => ({
    id: aliases[field.name] ?? field.name,
    label: field.label,
    type: field.type === "tel" ? "phone" : (field.type ?? "text"),
    required: Boolean(field.required),
    help: "",
    options: field.options ?? [],
  }));
}
export function validateForm(fields: FormField[], values: Record<string, string | boolean>) {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const value = values[field.id];
    const text = typeof value === "string" ? value.trim() : "";
    if (
      field.required &&
      (field.type === "consent" || field.type === "checkbox" ? value !== true : !text)
    )
      errors[field.id] =
        field.type === "consent"
          ? "Aceptá la política de privacidad para continuar."
          : "Campo obligatorio";
    else if (text && field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text))
      errors[field.id] = "Ingresá un email válido";
    else if (text && field.type === "phone" && !/^[+\d\s()-]{6,20}$/.test(text))
      errors[field.id] = "Ingresá un teléfono válido";
    else if (text.length > 2000) errors[field.id] = "Máximo 2000 caracteres";
    else if (
      text &&
      field.type === "select" &&
      field.options.length &&
      !field.options.includes(text)
    )
      errors[field.id] = "Elegí una opción válida";
  }
  return errors;
}
