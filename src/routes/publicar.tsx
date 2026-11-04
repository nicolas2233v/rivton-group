import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/site";
import { LeadForm } from "@/components/lead-form";
import strip from "@/assets/architecture-strip.jpg";

export const Route = createFileRoute("/publicar")({
  head: () => ({
    meta: [
      { title: "Publicá tu propiedad — RIVTON Group" },
      { name: "description", content: "Vendé o alquilá tu inmueble con la estrategia y el respaldo de RIVTON Group." },
      { property: "og:title", content: "Publicá tu propiedad — RIVTON Group" },
      { property: "og:description", content: "Te acompañamos para que tu inmueble llegue a las personas indicadas." },
    ],
  }),
  component: Publish,
});

function Publish() {
  return (
    <div className="lg:grid lg:grid-cols-2">
      <div>
        <PageTitle eyebrow="Propietarios" title="Publicá tu propiedad.">
          Te acompañamos para que tu inmueble llegue a las personas indicadas, con la experiencia y el respaldo de RIVTON Group.
        </PageTitle>
        <div className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
          <LeadForm
            submitLabel="Enviar solicitud"
            fields={[
              { name: "nombre", label: "Nombre y apellido", required: true },
              { name: "telefono", label: "Teléfono", type: "tel", required: true },
              { name: "email", label: "Email", type: "email", required: true },
              { name: "tipo", label: "Tipo de inmueble", type: "select", options: ["Casa", "Departamento", "Terreno", "Local", "Oficina"], required: true },
              { name: "operacion", label: "Operación", type: "select", options: ["Venta", "Alquiler"], required: true },
              { name: "ubicacion", label: "Ubicación", required: true },
              { name: "mensaje", label: "Comentarios", type: "textarea" },
            ]}
          />
        </div>
      </div>
      <img src={strip} alt="Arquitectura contemporánea" loading="lazy" className="hidden h-full w-full object-cover lg:block" />
    </div>
  );
}
