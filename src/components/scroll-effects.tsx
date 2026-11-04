import { useEffect, useRef, type ReactNode } from "react";

export function ScrollEffects({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reveals = Array.from(node.querySelectorAll<HTMLElement>("[data-reveal]"));
    const images = Array.from(node.querySelectorAll<HTMLElement>("[data-parallax]"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-visible", "true");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((item) => observer.observe(item));
    node.setAttribute("data-motion-ready", "true");
    let frame = 0;
    const update = () => {
      frame = 0;
      images.forEach((image) => {
        const rect = image.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const offset = motion.matches ? 0 : Math.max(-24, Math.min(24, (window.innerHeight / 2 - rect.top - rect.height / 2) * 0.06));
        image.style.setProperty("--parallax-offset", `${offset}px`);
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, []);
  return <div ref={root}>{children}</div>;
}