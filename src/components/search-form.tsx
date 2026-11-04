import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, SlidersHorizontal, ExternalLink, Building2, Wallet, BedDouble, Bath, ArrowRight } from "lucide-react";
import { PremiumSelect } from "@/components/premium-select";
import { Button } from "@/components/ui/button";
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
      className="search-panel rounded-lg border bg-background p-4 sm:p-5"
    >
      <div className="mb-4 flex items-center gap-2 text-sm">
        {(["venta", "alquiler"] as const).map((op) => (
          <Button key={op} variant="ghost" type="button" onClick={() => set("operacion", op)} aria-pressed={f.operacion === op}
            className={`rounded-full px-4 py-2 font-medium ${f.operacion === op ? "bg-ink text-ink-foreground hover:bg-ink/90 hover:text-ink-foreground" : "text-muted-foreground"}`}>
            {op === "venta" ? "Comprar" : "Alquilar"}
          </Button>
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
        <PremiumSelect label="Tipo de inmueble" icon={Building2} value={f.tipo ?? ""} onValueChange={(v) => set("tipo", v as PropertyFilters["tipo"])} options={[{value:"",label:"Tipo de inmueble"}, ...["casa", "departamento", "terreno", "local", "oficina"].map((v) => ({value:v,label:v.charAt(0).toUpperCase()+v.slice(1)}))]} />
        <PremiumSelect label="Precio máximo" icon={Wallet} value={String(f.precioMax ?? "")} onValueChange={(v) => set("precioMax", v ? Number(v) : "")} options={[{value:"",label:"Sin límite de precio"}, ...[150000,250000,350000,500000,750000].map((v) => ({value:String(v),label:`Hasta USD ${v.toLocaleString("es-AR")}`}))]} />
        <PremiumSelect label="Dormitorios" icon={BedDouble} value={String(f.dormitorios ?? "")} onValueChange={(v) => set("dormitorios", v ? Number(v) : "")} options={[{value:"",label:"Dormitorios"}, ...[1,2,3,4].map((v) => ({value:String(v),label:`${v}+ dorm.`}))]} />
        <PremiumSelect label="Baños" icon={Bath} value={String(f.banos ?? "")} onValueChange={(v) => set("banos", v ? Number(v) : "")} options={[{value:"",label:"Baños"}, ...[1,2,3,4].map((v) => ({value:String(v),label:`${v}+ baños`}))]} />
      </div>
      <Button variant="ghost" type="button" aria-expanded={more} onClick={() => setMore(!more)} className="mt-3 px-0 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground">
        <SlidersHorizontal className="h-4 w-4" /> Filtros adicionales
      </Button>
      {more && (
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!f.piscina} onChange={(e) => set("piscina", e.target.checked || "")} className="h-4 w-4 accent-foreground" />
          Con piscina
        </label>
      )}
      <Button type="submit" className="group mt-4 h-12 w-full rounded-lg font-semibold">
        Buscar propiedades <ArrowRight className="transition-transform group-hover:translate-x-1" />
      </Button>
    </form>
  );
}
