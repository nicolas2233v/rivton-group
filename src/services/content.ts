// Content service. Today it reads local typed data; set VITE_WP_API_URL later
// and implement the WordPress adapters below without touching UI components.
import { localProperties, localSettings, localTeam } from "@/data/properties";
import type { Property, SiteSettings, TeamInfo } from "@/lib/types";

/** Shape of a WordPress `inmueble` post with ACF fields (to be confirmed). */
export interface WPProperty {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: Record<string, unknown>;
}

export function adaptWPProperty(wp: WPProperty): Property {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const a = wp.acf as any;
  return {
    id: String(wp.id),
    slug: wp.slug,
    title: wp.title.rendered,
    operation: a.operacion ?? "venta",
    type: a.tipo ?? "casa",
    price: a.precio ? { amount: Number(a.precio), currency: a.moneda ?? "USD" } : null,
    bedrooms: a.dormitorios ?? undefined,
    bathrooms: a.banos ?? undefined,
    lotArea: a.terreno ?? undefined,
    coveredArea: a.cubiertos ?? undefined,
    location: a.ubicacion ?? undefined,
    code: a.codigo ?? undefined,
    amenities: a.amenities ?? [],
    description: a.descripcion ?? undefined,
    images: (a.galeria ?? []).map((g: any) => ({ src: g.url, alt: g.alt ?? wp.title.rendered })),
    featured: Boolean(a.destacado),
    featuredOrder: a.orden_destacado ?? undefined,
    publishedAt: a.fecha ?? new Date().toISOString(),
    whatsapp: a.whatsapp ?? undefined,
    calendlyUrl: a.calendly ?? undefined,
  };
}

export async function getProperties(): Promise<Property[]> {
  return localProperties;
}
export async function getPropertyBySlug(slug: string) {
  return localProperties.find((p) => p.slug === slug) ?? null;
}
export async function getFeatured() {
  return localProperties
    .filter((p) => p.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
}
export async function getLatest(limit = 4) {
  return [...localProperties].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, limit);
}
export async function getSettings(): Promise<SiteSettings> {
  return localSettings;
}
export async function getTeam(): Promise<TeamInfo> {
  return localTeam;
}
