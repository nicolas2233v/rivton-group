import { track } from "./measurement";
import { useState, useRef, useId } from "react";
import type { Field } from "@/components/lead-form";
import { usePublished } from "@/platform/content-context";
import { submitForm } from "@/platform/forms";
import { PremiumSelect } from "@/components/premium-select";
import { Button } from "@/components/ui/button";
import { approvedFields, initialFormValues, validateForm } from "./form-presentation";

export function ManagedForm({
  slug,
  propertyId,
  fields: fallbackFields = [],
  submitLabel = "Enviar consulta",
  defaults = {},
}: {
  slug: string;
  propertyId?: string | undefined;
  fields?: Field[];
  submitLabel?: string;
  defaults?: Record<string, string> | undefined;
}) {
  const cms = usePublished(),
    form = cms?.forms[slug];
  const fields = form?.active ? form.fields : approvedFields(fallbackFields);
  const [values, setValues] = useState<Record<string, string | boolean>>(() =>
    initialFormValues(defaults),
  );
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Awaited<ReturnType<typeof submitForm>> | null>(null);
  const key = useRef("");
  const [honeypot, setHoneypot] = useState("");
  const prefix = useId();
  const id = cms?.formIds?.[slug];
  const change = (name: string, value: string | boolean) => {
    setValues((p) => ({ ...p, [name]: value }));
    setErrors((p) => {
      const next = { ...p };
      delete next[name];
      return next;
    });
    key.current = "";
    setResult(null);
    setError("");
  };
  const cls =
    "w-full rounded-lg border bg-background px-3 py-3 text-sm outline-none focus:border-foreground";
  return (
    <form
      noValidate
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy || !form?.active) return;
        const problems = validateForm(fields, values);
        setErrors(problems);
        setError("");
        if (Object.keys(problems).length) {
          document.getElementById(`${prefix}-${Object.keys(problems)[0]}`)?.focus();
          return;
        }
        setBusy(true);
        if (!key.current) key.current = crypto.randomUUID();
        try {
          if (!id) throw new Error("El formulario no está disponible. Intentá nuevamente.");
          const response = await submitForm({
            data: {
              formId: id,
              answers: values,
              key: key.current,
              propertyId: propertyId ?? null,
              path: window.location.pathname,
              honeypot: honeypot as "",
            },
          });
          setResult(response);
          if (response.stored && !response.duplicate)
            track("generate_lead", { form_id: id }, `lead:${key.current}`);
          track(
            slug === "publicar" ? "publish_property_form_submit" : "contact_form_submit",
            { form_id: id },
            `submit:${key.current}`,
          );
        } catch (e) {
          setError(e instanceof Error ? e.message : "No se pudo completar la consulta.");
        } finally {
          setBusy(false);
        }
      }}
    >
      {fields.map((field) => {
        const fieldId = `${prefix}-${field.id}`,
          errorId = `${fieldId}-error`,
          helpId = `${fieldId}-help`;
        const checkbox = ["consent", "checkbox"].includes(field.type);
        const described =
          [field.help ? helpId : "", errors[field.id] ? errorId : ""].filter(Boolean).join(" ") ||
          undefined;
        const options =
          field.type === "select"
            ? field.id === "property_type"
              ? cms!.catalogs.filter((c) => c.kind === "type").map((c) => c.label)
              : field.id === "operation"
                ? cms!.catalogs.filter((c) => c.kind === "operation").map((c) => c.label)
                : field.options
            : [];
        const control =
          field.type === "select" ? (
            <PremiumSelect
              id={fieldId}
              label={field.label}
              invalid={Boolean(errors[field.id])}
              value={String(values[field.id] ?? "")}
              onValueChange={(v) => change(field.id, v)}
              options={[
                { value: "", label: "Seleccionar" },
                ...options.map((v) => ({ value: v, label: v })),
              ]}
            />
          ) : field.type === "textarea" ? (
            <textarea
              id={fieldId}
              className={cls}
              rows={4}
              maxLength={2000}
              required={field.required}
              aria-invalid={Boolean(errors[field.id])}
              aria-describedby={described}
              value={String(values[field.id] ?? "")}
              onChange={(e) => change(field.id, e.target.value)}
            />
          ) : checkbox ? (
            <input
              id={fieldId}
              type="checkbox"
              required={field.required}
              checked={values[field.id] === true}
              aria-invalid={Boolean(errors[field.id])}
              aria-describedby={described}
              onChange={(e) => change(field.id, e.target.checked)}
            />
          ) : (
            <input
              id={fieldId}
              type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
              className={cls}
              required={field.required}
              maxLength={2000}
              autoComplete={
                field.type === "email"
                  ? "email"
                  : field.type === "phone"
                    ? "tel"
                    : field.id === "name"
                      ? "name"
                      : undefined
              }
              aria-invalid={Boolean(errors[field.id])}
              aria-describedby={described}
              value={String(values[field.id] ?? "")}
              onChange={(e) => change(field.id, e.target.value)}
            />
          );
        const label = (
          <label
            className={
              checkbox
                ? "text-xs leading-relaxed text-muted-foreground"
                : "mb-1 block text-xs font-medium text-muted-foreground"
            }
            htmlFor={fieldId}
          >
            {field.label}
            {field.required && " *"}
            {field.type === "consent" && (
              <>
                {" "}
                (
                <a href="/privacidad" className="underline" target="_blank" rel="noreferrer">
                  Leer política
                </a>
                )
              </>
            )}
          </label>
        );
        return (
          <div key={field.id}>
            {checkbox ? (
              <div className="flex items-start gap-2">
                {control}
                {label}
              </div>
            ) : (
              <>
                {label}
                {control}
              </>
            )}
            {field.help && (
              <p id={helpId} className="mt-1 text-xs text-muted-foreground">
                {field.help}
              </p>
            )}
            {errors[field.id] && (
              <p id={errorId} className="mt-1 text-xs text-destructive" role="alert">
                {errors[field.id]}
              </p>
            )}
          </div>
        );
      })}
      <div hidden aria-hidden="true">
        <label>
          Sitio web
          <input
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>
      <Button
        type="submit"
        className="h-12 w-full rounded-lg font-semibold"
        disabled={busy || !form?.active || Boolean(result?.stored)}
      >
        {busy ? "Enviando…" : submitLabel}
      </Button>
      {!form?.active && (
        <p role="status" className="text-xs text-muted-foreground">
          Para consultar ahora,{" "}
          <a
            className="underline"
            href={`https://wa.me/${cms?.configuration?.whatsapp ?? ""}`}
            target="_blank"
            rel="noreferrer"
          >
            escribinos por WhatsApp
          </a>
          .
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-lg border border-destructive p-3 text-sm">
          {error}
        </p>
      )}
      {result && (
        <div role="status" className="rounded-lg bg-secondary p-4 text-sm">
          <p>
            {result.stored ? "Recibimos tu consulta. " : ""}
            {result.message}
          </p>
          {result.whatsapp && (
            <a
              className="mt-3 inline-block underline"
              href={result.whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              Continuar por WhatsApp
            </a>
          )}
          <p className="mt-2 text-xs">Podés revisar el mensaje antes de enviarlo por WhatsApp.</p>
        </div>
      )}
    </form>
  );
}
