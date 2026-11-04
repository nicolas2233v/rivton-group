import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import exterior from "@/assets/hero-house.jpg";
import interior from "@/assets/interior-living.jpg";
import { Button } from "@/components/ui/button";

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
      const distance = Math.max(1, rect.height - window.innerHeight);
      const progress = reduced.matches ? 0 : Math.min(1, Math.max(0, -rect.top / distance));
      node.style.setProperty("--story-progress", String(progress));
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
        <img src={exterior} alt="Casa contemporánea con grandes ventanales" loading="lazy" className="story-image story-exterior" />
        <img src={interior} alt="Interior residencial luminoso" loading="lazy" className="story-image story-interior" />
        <div className="story-shade" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-between px-5 py-10 text-ink-foreground lg:px-8 lg:py-16">
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
          <div className="story-progress-track" aria-hidden="true"><div className="story-progress-fill" /></div>
        </div>
      </div>
    </section>
  );
}