import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, SlidersHorizontal, ExternalLink } from "lucide-react";
import type { PropertyFilters } from "@/lib/types";
import { TEMPORARIOS_URL } from "./site";

const sel = "h-12 w-full appearance-none rounded-lg border bg-background px-3 text-sm font-medium outline-none focus:border-foreground";

export function SearchForm({ initial = {} }: { initial?: PropertyFilters }) {
  const navigate = useNavigate();
  const [f, setF] = useState<PropertyFilters>({ operacion: "venta", ...initial });
  const [more, setMore] = useState(false);
  const set = <K extends keyof PropertyFilters>(k: K, v: PropertyFilters[K] | "") =>
    setF((s) => ({ ...s, [k]: v === "" ? undefined : v }));

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); navigate({ to: "/propiedades", search: f }); }}
      className="rounded-2xl border bg-background p-4 shadow-[0_10px_40px_-20px_oklch(0_0_0/0.25)] sm:p-5"
    >
      <div className="mb-4 flex items-center gap-2 text-sm">
        {(["venta", "alquiler"] as const).map((op) => (
          <button key={op} type="button" onClick={() => set("operacion", op)}
            className={`rounded-full px-4 py-2 font-medium ${f.operacion === op ? "bg-ink text-ink-foreground" : "text-muted-foreground"}`}>
            {op === "venta" ? "Comprar" : "Alquilar"}
          </button>
        ))}
        <a href={TEMPORARIOS_URL} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1 text-muted-foreground">
          Temporarios <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        <label className="relative sm:col-span-2 lg:col-span-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input aria-label="Ubicación" placeholder="¿Dónde buscás?" value={f.ubicacion ?? ""} onChange={(e) => set("ubicacion", e.target.value)} className={`${sel} pl-9`} />
        </label>
        <select aria-label="Tipo de inmueble" value={f.tipo ?? ""} onChange={(e) => set("tipo", e.target.value as PropertyFilters["tipo"])} className={sel}>
          <option value="">Tipo de inmueble</option>
          <option value="casa">Casa</option><option value="departamento">Departamento</option>
          <option value="terreno">Terreno</option><option value="local">Local</option><option value="oficina">Oficina</option>
        </select>
        <select aria-label="Precio máximo" value={f.precioMax ?? ""} onChange={(e) => set("precioMax", e.target.value ? Number(e.target.value) : "")} className={sel}>
          <option value="">Precio</option>
          {[150000, 250000, 350000, 500000, 750000].map((v) => <option key={v} value={v}>Hasta USD {v.toLocaleString("es-AR")}</option>)}
        </select>
        <select aria-label="Dormitorios" value={f.dormitorios ?? ""} onChange={(e) => set("dormitorios", e.target.value ? Number(e.target.value) : "")} className={sel}>
          <option value="">Dormitorios</option>
          {[1, 2, 3, 4].map((v) => <option key={v} value={v}>{v}+ dorm.</option>)}
        </select>
        <select aria-label="Baños" value={f.banos ?? ""} onChange={(e) => set("banos", e.target.value ? Number(e.target.value) : "")} className={sel}>
          <option value="">Baños</option>
          {[1, 2, 3, 4].map((v) => <option key={v} value={v}>{v}+ baños</option>)}
        </select>
      </div>
      <button type="button" onClick={() => setMore(!more)} className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4" /> Filtros adicionales
      </button>
      {more && (
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!f.piscina} onChange={(e) => set("piscina", e.target.checked || "")} className="h-4 w-4 accent-foreground" />
          Con piscina
        </label>
      )}
      <button type="submit" className="mt-4 h-12 w-full rounded-lg bg-ink text-sm font-semibold text-ink-foreground transition-opacity hover:opacity-90">
        Buscar propiedades
      </button>
    </form>
  );
}
