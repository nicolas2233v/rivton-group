import { createFileRoute } from "@tanstack/react-router";
import { MapPin, MessageCircle } from "lucide-react";
import { PageTitle } from "@/components/site";
import { LeadForm } from "@/components/lead-form";
import { getSettings } from "@/services/content";

export const Route = createFileRoute("/contacto")({
  validateSearch: (s: Record<string, unknown>): { propiedad?: string } =>
    typeof s["propiedad"] === "string" ? { propiedad: s["propiedad"] } : {},
  head: () => ({
    meta: [
      { title: "Contacto — RIVTON Group" },
      { name: "description", content: "Escribile a RIVTON Group para consultar por propiedades o publicar la tuya." },
      { property: "og:title", content: "Contacto — RIVTON Group" },
      { property: "og:description", content: "Consultas sobre propiedades en Córdoba." },
    ],
  }),
  loader: () => getSettings(),
  component: Contact,
});

function Contact() {
  const s = Route.useLoaderData();
  const { propiedad } = Route.useSearch();
  return (
    <>
      <PageTitle eyebrow="Contacto" title="Hablemos.">Contanos qué estás buscando y te respondemos a la brevedad.</PageTitle>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 lg:grid-cols-[1.3fr_1fr] lg:px-8">
        <LeadForm
          submitLabel="Enviar consulta"
          defaults={propiedad ? { mensaje: `Consulta por: ${propiedad}` } : {}}
          fields={[
            { name: "nombre", label: "Nombre y apellido", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "telefono", label: "Teléfono", type: "tel" },
            { name: "mensaje", label: "Mensaje", type: "textarea", required: true },
          ]}
        />
        <aside className="space-y-4 text-sm">
          {s.address && <p className="flex gap-3 rounded-xl border p-4"><MapPin className="h-5 w-5 shrink-0" />{s.address}</p>}
          {s.whatsapp && (
            <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-secondary p-4 font-semibold">
              <MessageCircle className="h-5 w-5" /> WhatsApp
            </a>
          )}
        </aside>
      </div>
    </>
  );
}
