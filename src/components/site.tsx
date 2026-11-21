import { usePublished } from "@/platform/content-context";
import { track } from "@/platform/measurement";
import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Home,
  Search,
  Heart,
  PlusCircle,
  Menu,
  X,
  Users,
  Mail,
  ExternalLink,
  MapPin,
  Clock,
} from "lucide-react";
import { getSettings } from "@/services/content";
import type { SiteSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";

export const TEMPORARIOS_URL = "https://www.tempohogar.com.ar/";

export function Logo({
  className = "",
  alternate = false,
}: {
  className?: string;
  alternate?: boolean;
}) {
  const config = usePublished()?.configuration;
  const logo = alternate ? (config?.alternateLogo ?? config?.logo) : config?.logo;
  if (logo)
    return (
      <img
        src={logo.src}
        alt={config?.name ?? "RIVTON Group"}
        width={logo.width}
        height={logo.height}
        className={`h-10 w-auto max-w-40 object-contain ${className}`}
      />
    );
  return (
    <span
      className={`relative inline-flex flex-col items-start leading-none text-ink-foreground ${className}`}
      aria-label="RIVTON Group"
    >
      <svg viewBox="0 0 120 14" className="h-3 w-[7.5rem]" aria-hidden>
        <path d="M2 13 Q60 -4 118 6" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
      <span className="absolute right-0 top-0 text-[7px] font-semibold tracking-[0.35em]">
        GROUP
      </span>
      <span className="-mt-0.5 font-sans text-[26px] font-medium tracking-[0.12em]">RIVTON</span>
    </span>
  );
}

const MENU = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/propiedades", label: "Explorar propiedades", icon: Search },
  { to: "/favoritos", label: "Favoritos", icon: Heart },
  { to: "/publicar", label: "Publicá tu propiedad", icon: PlusCircle },
  { to: "/nosotros", label: "Nosotros", icon: Users },
  { to: "/contacto", label: "Contacto", icon: Mail },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const cms = usePublished();
  const icons: Record<string, typeof Home> = {
    "/": Home,
    "/propiedades": Search,
    "/favoritos": Heart,
    "/publicar": PlusCircle,
    "/nosotros": Users,
    "/contacto": Mail,
  };
  const menu = cms?.configuration
    ? [
        { to: "/", label: "Inicio", icon: Home },
        ...cms.configuration.menu
          .filter((m) => m.href.startsWith("/") && m.href !== "/")
          .map((m) => ({ to: m.href, label: m.label, icon: icons[m.href] ?? ExternalLink })),
      ]
    : MENU;
  const temporaries = cms?.configuration?.temporariesUrl ?? TEMPORARIOS_URL;
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 72);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      {location.pathname !== "/" && <div className="h-[88px] bg-background" aria-hidden="true" />}
      <header
        data-scrolled={scrolled}
        data-home={location.pathname === "/"}
        className="site-header fixed z-40"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link to="/" aria-label="Inicio">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-7 text-sm lg:flex">
            {menu.slice(1).map((m) => (
              <Link
                key={m.to}
                to={m.to}
                className="opacity-80 transition-opacity hover:opacity-100"
                activeProps={{ className: "opacity-100 underline underline-offset-8" }}
              >
                {m.label.replace(" propiedades", "")}
              </Link>
            ))}
            <a
              href={temporaries}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 opacity-80 hover:opacity-100"
            >
              Temporarios <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </nav>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className="hover:bg-ink-foreground/10 hover:text-ink-foreground lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {open && (
        <div
          className="mobile-menu fixed z-50 flex flex-col text-ink-foreground animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <div className="flex h-16 items-center justify-between px-5">
            <Logo />
            <Button
              autoFocus
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="hover:bg-ink-foreground/10 hover:text-ink-foreground"
            >
              <X className="h-7 w-7" />
            </Button>
          </div>
          <div className="mx-5 border-t border-ink-foreground/15" />
          <nav className="flex flex-1 flex-col gap-1 px-5 py-6">
            {menu.map((m) => (
              <Link
                key={m.to}
                to={m.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 py-3 text-lg"
              >
                <m.icon className="h-5 w-5 opacity-80" /> {m.label}
              </Link>
            ))}
            <a
              href={temporaries}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 py-3 text-lg"
            >
              <ExternalLink className="h-5 w-5 opacity-80" /> Temporarios ↗
            </a>
          </nav>
        </div>
      )}

      <main>{children}</main>
      <Footer />

      <nav
        data-scrolled={scrolled}
        className="mobile-dock fixed z-40 lg:hidden"
        aria-label="Navegación inferior"
      >
        <div className="grid grid-cols-5">
          {[
            { to: "/", label: "Inicio", icon: Home },
            { to: "/propiedades", label: "Explorar", icon: Search },
            { to: "/favoritos", label: "Favoritos", icon: Heart },
            { to: "/publicar", label: "Publicar", icon: PlusCircle },
          ].map((t) => (
            <Link
              key={t.to}
              to={t.to}
              activeOptions={{ exact: t.to === "/" }}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground"
              activeProps={{ className: "!text-foreground font-semibold" }}
            >
              <t.icon className="h-5 w-5" /> {t.label}
            </Link>
          ))}
          <Button
            variant="ghost"
            onClick={() => setOpen(true)}
            className="h-auto flex-col gap-1 rounded-none py-2.5 text-[11px] text-muted-foreground"
          >
            <Menu className="h-5 w-5" /> Menú
          </Button>
        </div>
      </nav>
    </div>
  );
}

function Footer() {
  const cms = usePublished();
  const temporaries = cms?.configuration?.temporariesUrl ?? TEMPORARIOS_URL;
  const menu = cms?.configuration
    ? cms.configuration.menu
        .filter((m) => m.href.startsWith("/"))
        .map((m) => ({ to: m.href, label: m.label }))
    : MENU.slice(1);
  const [local, setSettings] = useState<SiteSettings | null>(null);
  useEffect(() => {
    let active = true;
    if (cms) return;
    void getSettings()
      .then((settings) => {
        if (active) setSettings(settings);
      })
      .catch(() => {
        if (active) setSettings(null);
      });
    return () => {
      active = false;
    };
  }, [cms]);
  const s = cms?.settings ?? local;
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <div className="grid gap-10 border-b border-ink-foreground/15 pb-10 md:grid-cols-[1.2fr_.8fr_1fr] lg:gap-16">
          <div>
            <Logo alternate className="h-12 max-w-48" />
            <p className="mt-5 max-w-sm font-display text-3xl leading-snug text-ink-foreground/90">
              {cms?.configuration?.footerText ?? "Propiedades con criterio, en Córdoba."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {(cms?.configuration?.instagram ??
                s?.socials.find((social) => /instagram/i.test(social.url))?.url) && (
                <a
                  href={
                    cms?.configuration?.instagram ??
                    s?.socials.find((social) => /instagram/i.test(social.url))?.url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink-foreground/25 px-4 text-sm transition-colors hover:bg-ink-foreground/10"
                >
                  <img
                    src="/brand/instagram.svg"
                    alt=""
                    width={19}
                    height={19}
                    className="invert"
                  />
                  Instagram
                </a>
              )}
              {s?.whatsapp && (
                <a
                  href={`https://wa.me/${s.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink-foreground/25 px-4 text-sm transition-colors hover:bg-ink-foreground/10"
                >
                  <img src="/brand/whatsapp.svg" alt="" width={19} height={19} className="invert" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
          <nav aria-label="Navegación del footer">
            <p className="label-caps mb-5 text-ink-foreground/50">Explorá RIVTON</p>
            <ul className="space-y-3 text-sm text-ink-foreground/80">
              {menu.map((m) => (
                <li key={m.to}>
                  <Link to={m.to} className="underline-offset-4 hover:underline">
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="label-caps mb-5 text-ink-foreground/50">Encontranos</p>
            <div className="space-y-4 text-sm leading-relaxed text-ink-foreground/80">
              {s?.address && (
                <p className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {s.address}
                </p>
              )}
              {cms?.configuration?.hours && (
                <p className="flex gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                  {cms.configuration.hours}
                </p>
              )}
              {s?.email && (
                <a
                  href={`mailto:${s.email}`}
                  className="flex items-center gap-3 break-all hover:text-ink-foreground"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {s.email}
                </a>
              )}
            </div>
          </div>
        </div>
        <a
          href={temporaries}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Tempo Hogar: alojamientos temporarios"
          className="mt-7 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-ink-foreground/15 bg-ink-foreground/5 px-5 py-5 transition-colors hover:bg-ink-foreground/10 sm:px-7"
        >
          <div className="flex flex-wrap items-center gap-5">
            <img
              src="/brand/tempo-hogar.png"
              alt="Tempo Hogar"
              width={384}
              height={384}
              loading="lazy"
              className="h-16 w-16 rounded-lg object-contain"
            />
            <span className="text-sm text-ink-foreground/75">Alojamientos temporarios</span>
          </div>
          <ExternalLink className="h-5 w-5 shrink-0" aria-hidden="true" />
        </a>
      </div>
      <div className="border-t border-ink-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-5 py-5 text-xs text-ink-foreground/50 lg:px-8">
          <span>
            © {new Date().getFullYear()} {cms?.configuration?.name ?? "RIVTON Group"}
          </span>
          <span className="flex gap-5">
            {cms?.pages["terminos"] ? (
              <a href="/terminos">Términos y condiciones</a>
            ) : (
              <span>Términos y condiciones</span>
            )}
            {cms?.pages["privacidad"] ? (
              <a href="/privacidad">Política de privacidad</a>
            ) : (
              <span>Política de privacidad</span>
            )}
          </span>
        </div>
      </div>
    </footer>
  );
}

export function PageTitle({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-6 pt-8 lg:px-8 lg:pt-14">
      {eyebrow && <p className="label-caps mb-3 text-muted-foreground">{eyebrow}</p>}
      <h1 className="text-4xl leading-[1.05] lg:text-6xl">{title}</h1>
      {children && (
        <div className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          {children}
        </div>
      )}
    </div>
  );
}
