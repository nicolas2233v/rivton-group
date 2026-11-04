import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { getSettings, getTeam } from "@/services/content";

export const Route = createFileRoute("/nosotros")({
  head: () => ({
    meta: [
      { title: "Nosotros — RIVTON Group" },
      { name: "description", content: "Conocé al equipo de RIVTON Group, inmobiliaria en Córdoba." },
      { property: "og:title", content: "Nosotros — RIVTON Group" },
      { property: "og:description", content: "Un equipo dedicado a la comercialización de propiedades en Córdoba." },
    ],
  }),
  loader: async () => ({ team: await getTeam(), settings: await getSettings() }),
  component: About,
});

function About() {
  const { team, settings } = Route.useLoaderData();
  return (
    <>
      <section className="relative bg-ink text-ink-foreground">
        <img src={team.image.src} alt={team.image.alt} width={1280} height={960} className="h-[62vh] max-h-[680px] w-full object-cover opacity-90" />
        <div className="hero-scrim absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-8 lg:px-8 lg:pb-14">
          <h1 className="max-w-2xl text-5xl leading-[0.98] lg:text-7xl">{team.title}</h1>
        </div>
      </section>
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-5 pb-14 pt-6 lg:px-8">
          <p className="max-w-2xl text-[15px] leading-relaxed text-ink-foreground/80 lg:text-lg">{team.body}</p>
          <Link to="/contacto" className="mt-8 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-foreground">
            Hablemos <ArrowRight className="h-4 w-4" />
          </Link>
          {settings.address && (
            <p className="mt-10 flex items-center gap-2 border-t border-ink-foreground/15 pt-6 text-sm text-ink-foreground/75"><MapPin className="h-4 w-4" />{settings.address}</p>
          )}
        </div>
      </section>
    </>
  );
}
