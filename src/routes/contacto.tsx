import { EditableText, EditableImage } from "@/platform/editable";
import { pageSEO } from "@/platform/seo";
import { usePublished, useElement } from "@/platform/content-context";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, MessageCircle, Mail, Clock } from "lucide-react";
import { PageTitle } from "@/components/site";
import { LeadForm } from "@/components/lead-form";
import { loadSiteSettings } from "@/services/content";

export const Route = createFileRoute("/contacto")({
  validateSearch: (s: Record<string, unknown>): { propiedad?: string } =>
    typeof s["propiedad"] === "string" ? { propiedad: s["propiedad"] } : {},
  head: ({ matches }) =>
    pageSEO(matches, "contacto") ?? {
      meta: [
        { title: "Contacto — RIVTON Group" },
        {
          name: "description",
          content: "Escribile a RIVTON Group para consultar por propiedades o publicar la tuya.",
        },
        { property: "og:title", content: "Contacto — RIVTON Group" },
        { property: "og:description", content: "Consultas sobre propiedades en Córdoba." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    },
  loader: loadSiteSettings,
  component: Contact,
});

function Contact() {
  const s = Route.useLoaderData();
  const { propiedad } = Route.useSearch();
  const cms = usePublished();
  const heading = useElement("contacto", "heading");
  return (
    <>
      <PageTitle
        eyebrow="Contacto"
        title={<EditableText page="contacto" id="heading" field="title" fallback="Hablemos." />}
      >
        <EditableText
          page="contacto"
          id="heading"
          field="body"
          fallback="Contanos qué estás buscando y te respondemos a la brevedad."
        />
      </PageTitle>
      <div className="mx-auto grid max-w-7xl items-start gap-6 px-5 pb-12 lg:grid-cols-[1.1fr_1fr] lg:gap-8 lg:px-8 lg:pb-16">
        <section
          aria-label="Formulario de contacto"
          className="inquiry-form contact-inquiry min-w-0 rounded-2xl border bg-card p-5 shadow-sm sm:p-7 lg:p-8"
        >
          <LeadForm
            purpose={propiedad ? "consulta-propiedad" : "contacto"}
            propertyId={cms?.properties.find((p) => p.title === propiedad)?.id}
            submitLabel="Enviar consulta"
            defaults={propiedad ? { mensaje: `Consulta por: ${propiedad}` } : {}}
            fields={[
              { name: "nombre", label: "Nombre y apellido", required: true },
              { name: "email", label: "Email", type: "email", required: true },
              { name: "telefono", label: "Teléfono", type: "tel" },
              { name: "mensaje", label: "Mensaje", type: "textarea", required: true },
            ]}
          />
        </section>
        <aside
          aria-label="Nuestra oficina y canales de contacto"
          className="min-w-0 space-y-5 rounded-2xl border bg-secondary/30 p-5 text-sm sm:p-6"
        >
          {(heading?.image || heading?.mobile.image || heading?.desktop.image) && (
            <div className="overflow-hidden rounded-xl">
              <EditableImage
                page="contacto"
                id="heading"
                fallback=""
                alt="Contacto"
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          )}
          {s.email && (
            <a
              className="flex items-center gap-3 break-all text-muted-foreground hover:text-foreground"
              href={`mailto:${s.email}`}
            >
              <Mail className="h-4 w-4 shrink-0" />
              {s.email}
            </a>
          )}
          {s.address && (
            <p className="flex gap-3 leading-relaxed text-muted-foreground">
              <MapPin className="h-5 w-5 shrink-0" />
              {s.address}
            </p>
          )}
          {cms?.configuration?.hours && (
            <p className="flex gap-3 leading-relaxed text-muted-foreground">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" />
              {cms.configuration.hours}
            </p>
          )}
          {s.whatsapp && (
            <a
              href={`https://wa.me/${s.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink p-4 font-semibold text-ink-foreground"
            >
              <MessageCircle className="h-5 w-5" /> WhatsApp
            </a>
          )}
        </aside>
      </div>
    </>
  );
}
