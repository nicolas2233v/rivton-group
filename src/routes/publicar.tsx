import { EditableImage, EditableText } from "@/platform/editable";
import { pageSEO } from "@/platform/seo";
import { createFileRoute } from "@tanstack/react-router";
import { LeadForm } from "@/components/lead-form";
import strip from "@/assets/architecture-strip.jpg";

export const Route = createFileRoute("/publicar")({
  head: ({ matches }) =>
    pageSEO(matches, "publicar") ?? {
      meta: [
        { title: "Publicá tu propiedad — RIVTON Group" },
        {
          name: "description",
          content: "Vendé o alquilá tu inmueble con la estrategia y el respaldo de RIVTON Group.",
        },
        { property: "og:title", content: "Publicá tu propiedad — RIVTON Group" },
        {
          property: "og:description",
          content: "Te acompañamos para que tu inmueble llegue a las personas indicadas.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    },
  component: Publish,
});

function Publish() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
      <div className="grid items-start gap-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-12">
        <section className="min-w-0">
          <p className="label-caps mb-4 text-muted-foreground">Propietarios</p>
          <h1 className="max-w-lg text-4xl leading-[1.05] lg:text-5xl">
            <EditableText
              page="publicar"
              id="heading"
              field="title"
              fallback="Publicá tu propiedad."
            />
          </h1>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            <EditableText
              page="publicar"
              id="heading"
              field="body"
              fallback="Te acompañamos para que tu inmueble llegue a las personas indicadas, con la experiencia y el respaldo de RIVTON Group."
            />
          </p>
          <div className="mt-7 hidden overflow-hidden rounded-2xl md:block">
            <EditableImage
              page="publicar"
              id="heading"
              fallback={strip}
              alt="Arquitectura contemporánea"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </section>
        <section
          aria-label="Solicitud de publicación"
          className="inquiry-form min-w-0 rounded-2xl border bg-card p-5 shadow-sm sm:p-7 lg:p-8"
        >
          <LeadForm
            purpose="publicar"
            submitLabel="Enviar solicitud"
            fields={[
              { name: "nombre", label: "Nombre y apellido", required: true },
              { name: "telefono", label: "Teléfono", type: "tel", required: true },
              { name: "email", label: "Email", type: "email", required: true },
              {
                name: "tipo",
                label: "Tipo de inmueble",
                type: "select",
                options: ["Casa", "Departamento", "Terreno", "Local", "Oficina"],
                required: true,
              },
              {
                name: "operacion",
                label: "Operación",
                type: "select",
                options: ["Venta", "Alquiler"],
                required: true,
              },
              { name: "ubicacion", label: "Ubicación", required: true },
              { name: "mensaje", label: "Comentarios", type: "textarea" },
            ]}
          />
        </section>
      </div>
    </div>
  );
}
