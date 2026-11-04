import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import exterior from "@/assets/hero-house.jpg";
import interior from "@/assets/interior-living.jpg";
import { Button } from "@/components/ui/button";
import { SearchForm } from "@/components/search-form";

export function ScrollStory() {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const stage = node.querySelector<HTMLElement>(".story-stage");
      const distance = Math.max(1, rect.height - (stage?.offsetHeight ?? window.innerHeight));
      const progress = reduced.matches ? 0 : Math.min(1, Math.max(0, -rect.top / distance));
      node.style.setProperty("--story-progress", String(progress));
      node.style.setProperty("--intro-opacity", String(Math.max(0, 1 - progress / 0.3)));
      node.style.setProperty("--scene-opacity", String(Math.min(1, Math.max(0, (progress - 0.42) / 0.3))));
      node.style.setProperty("--image-reveal", String(Math.min(1, Math.max(0, (progress - 0.25) / 0.5))));
      const intro = node.querySelector<HTMLElement>(".story-intro");
      const scene = node.querySelector<HTMLElement>(".story-second");
      if (intro) { intro.inert = progress >= 0.3; intro.setAttribute("aria-hidden", String(progress >= 0.3)); }
      if (scene) { scene.inert = progress < 0.45; scene.setAttribute("aria-hidden", String(progress < 0.45)); }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <section ref={section} className="scroll-story" aria-label="Espacios RIVTON">
      <div className="story-stage">
        <img src={exterior} alt="Casa contemporánea con grandes ventanales" fetchPriority="high" className="story-image story-exterior" />
        <img src={interior} alt="Interior residencial luminoso" loading="lazy" className="story-image story-interior" />
        <div className="story-shade" />
        <div className="story-intro text-ink-foreground">
          <div className="story-intro-heading">
            <p className="label-caps mb-4 text-ink-foreground/85">RIVTON Group · Córdoba</p>
            <h1 className="text-5xl leading-[1.02] lg:text-7xl">Encontrá<br />tu propiedad.</h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-foreground/85">Propiedades seleccionadas para cada etapa de tu vida.</p>
          </div>
          <div className="text-foreground"><SearchForm immersive /></div>
        </div>
        <div className="story-second text-ink-foreground" aria-hidden="true" inert>
          <div className="story-caption flex items-center justify-between gap-3">
            <p className="label-caps">RIVTON · Espacios para vivir</p>
            <span className="font-display text-xl" aria-hidden="true">01 — 02</span>
          </div>
          <div className="story-copy">
            <h2 className="max-w-3xl text-5xl leading-[1.05] sm:text-6xl lg:text-8xl">Otra forma<br />de habitar.</h2>
            <div className="mt-7 flex flex-wrap items-end justify-between gap-6">
              <p className="max-w-xs text-sm leading-relaxed text-ink-foreground/85">Espacios que se sienten propios.<br />Desde el primer momento.</p>
              <Button asChild variant="outline" className="h-12 border-ink-foreground/40 bg-ink/10 px-5 text-ink-foreground backdrop-blur-md hover:bg-ink-foreground hover:text-ink">
                <Link to="/propiedades">Encontrá tu lugar <ArrowUpRight /></Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="story-progress-track" aria-hidden="true"><div className="story-progress-fill" /></div>
      </div>
    </section>
  );
}