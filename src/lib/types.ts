// Content model shaped to map 1:1 from a future WordPress REST API (custom post types + ACF).

export type Operation = "venta" | "alquiler";
export type PropertyType = "casa" | "departamento" | "terreno" | "local" | "oficina";

export interface PropertyImage {
  src: string;
  alt: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  operation: Operation;
  type: PropertyType;
  /** null = "Precio a consultar" */
  price: { amount: number; currency: "USD" | "ARS" } | null;
  bedrooms?: number;
  bathrooms?: number;
  lotArea?: number; // m² terreno
  coveredArea?: number; // m² cubiertos
  location?: string;
  code?: string;
  amenities: string[];
  description?: string;
  images: PropertyImage[];
  featured: boolean;
  featuredOrder?: number;
  publishedAt: string; // ISO
  whatsapp?: string;
  calendlyUrl?: string;
  coordinates?: { lat: number; lng: number };
}

export interface SiteSettings {
  whatsapp?: string;
  email?: string;
  phone?: string;
  address?: string;
  socials: { label: string; url: string }[];
}

export interface TeamInfo {
  title: string;
  body: string;
  image: PropertyImage;
}

export interface PropertyFilters {
  operacion?: Operation;
  ubicacion?: string;
  tipo?: PropertyType;
  precioMax?: number;
  dormitorios?: number;
  banos?: number;
  piscina?: boolean;
  orden?: "recientes" | "precio-asc" | "precio-desc";
}
