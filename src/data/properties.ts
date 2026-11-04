import type { Property, SiteSettings, TeamInfo } from "@/lib/types";
import claret from "@/assets/jardin-claret.jpg";
import sabin from "@/assets/sabin-6079.jpg";
import familiar from "@/assets/casa-familiar.jpg";
import interior from "@/assets/interior-living.jpg";
import team from "@/assets/team.jpg";

// Only confirmed data. Images are illustrative until real photos arrive.
export const localProperties: Property[] = [
  {
    id: "1",
    slug: "jardin-claret",
    title: "Jardín Claret",
    operation: "venta",
    type: "casa",
    price: { amount: 490000, currency: "USD" },
    bedrooms: 4,
    bathrooms: 4,
    lotArea: 426.3,
    amenities: ["Piscina"],
    images: [
      { src: claret, alt: "Jardín Claret — exterior con piscina" },
      { src: interior, alt: "Jardín Claret — living" },
    ],
    featured: true,
    featuredOrder: 1,
    publishedAt: "2026-10-20",
  },
  {
    id: "2",
    slug: "albert-brucce-sabin-6079",
    title: "Albert Brucce Sabin 6079",
    operation: "venta",
    type: "casa",
    price: { amount: 260000, currency: "USD" },
    bedrooms: 4,
    bathrooms: 4,
    amenities: ["Piscina", "Quincho", "Departamento anexo"],
    images: [
      { src: sabin, alt: "Albert Brucce Sabin 6079 — piscina y quincho" },
      { src: interior, alt: "Albert Brucce Sabin 6079 — interior" },
    ],
    featured: true,
    featuredOrder: 2,
    publishedAt: "2026-10-28",
  },
  {
    id: "3",
    slug: "casa-familiar",
    title: "Casa familiar",
    operation: "venta",
    type: "casa",
    price: null,
    bedrooms: 3,
    bathrooms: 2,
    lotArea: 450,
    coveredArea: 221,
    amenities: ["Piscina"],
    images: [
      { src: familiar, alt: "Casa familiar — exterior con piscina" },
      { src: interior, alt: "Casa familiar — interior" },
    ],
    featured: false,
    publishedAt: "2026-11-02",
  },
];

export const localSettings: SiteSettings = {
  // Configure from WordPress. Left empty on purpose — no sample contact data.
  address: "Luis José de Tejeda 3883 local A",
  socials: [],
};

export const localTeam: TeamInfo = {
  title: "Conocé RIVTON Group.",
  body: "Somos un equipo de profesionales dedicados a la comercialización de propiedades en Córdoba, con una mirada cercana y estratégica en cada operación.",
  image: { src: team, alt: "Equipo de RIVTON Group" },
};
