import { useEffect, useRef, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PropertyImage } from "@/lib/types";

export function PropertyGallery({
  images,
  actions,
}: {
  images: PropertyImage[];
  actions?: ReactNode;
}) {
  const [viewport, api] = useEmblaCarousel({ loop: images.length > 1 });
  const [selected, setSelected] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loaded, setLoaded] = useState<Set<string>>(() => new Set());
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const thumbnails = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!api) return;
    const update = () => setSelected(api.selectedScrollSnap());
    update();
    api.on("select", update).on("reInit", update);
    return () => {
      api.off("select", update).off("reInit", update);
    };
  }, [api]);
  useEffect(() => {
    const rail = thumbnails.current;
    const button = rail?.children[selected] as HTMLElement | undefined;
    if (!rail || !button) return;
    if (
      button.offsetLeft < rail.scrollLeft ||
      button.offsetLeft + button.offsetWidth > rail.scrollLeft + rail.clientWidth
    )
      rail.scrollTo({
        left: button.offsetLeft - (rail.clientWidth - button.offsetWidth) / 2,
        behavior: reducedMotion ? "instant" : "smooth",
      });
  }, [selected, reducedMotion]);
  const current = images[selected];
  return (
    <section
      aria-label="Fotos de la propiedad"
      aria-roledescription="carrusel"
      data-ready={Boolean(api)}
      className="min-w-0"
    >
      <div className="relative overflow-hidden bg-muted lg:rounded-2xl">
        <div
          ref={viewport}
          className="overflow-hidden"
          tabIndex={0}
          aria-label="Galería: usá las flechas o deslizá para cambiar de foto"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              api?.scrollNext(reducedMotion);
            }
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              api?.scrollPrev(reducedMotion);
            }
          }}
        >
          <div className="flex" style={{ touchAction: "pan-y pinch-zoom" }}>
            {images.map((image, index) => (
              <div
                key={image.src}
                className="relative aspect-[4/3] min-w-0 flex-[0_0_100%]"
                role="group"
                aria-roledescription="diapositiva"
                aria-label={`Foto ${index + 1} de ${images.length}`}
                aria-hidden={index !== selected}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  width={1280}
                  height={960}
                  draggable={false}
                  ref={(node) => {
                    if (node?.complete && node.naturalWidth > 0)
                      setLoaded((v) => (v.has(image.src) ? v : new Set(v).add(image.src)));
                  }}
                  loading={Math.abs(index - selected) <= 1 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className="h-full w-full object-cover"
                  onLoad={() => setLoaded((v) => new Set(v).add(image.src))}
                  onError={() => setFailed((v) => new Set(v).add(image.src))}
                />
              </div>
            ))}
          </div>
        </div>
        {actions}
        {images.length > 1 && (
          <>
            <button
              type="button"
              disabled={!api}
              aria-label="Foto anterior"
              onClick={() => api?.scrollPrev(reducedMotion)}
              className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/90 shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              disabled={!api}
              aria-label="Foto siguiente"
              onClick={() => api?.scrollNext(reducedMotion)}
              className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/90 shadow-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        {current && !loaded.has(current.src) && (
          <span
            role="status"
            className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-ink/75 px-3 py-1 text-xs text-ink-foreground"
          >
            {failed.has(current.src)
              ? "No se pudo cargar esta foto. Elegí otra imagen."
              : "Cargando foto…"}
          </span>
        )}
        <span
          aria-live="polite"
          aria-atomic="true"
          className="absolute bottom-4 right-4 rounded-full bg-ink/75 px-3 py-1 text-xs text-ink-foreground"
        >
          {images.length ? selected + 1 : 0}/{images.length}
        </span>
      </div>
      {images.length > 1 && (
        <div
          ref={thumbnails}
          aria-label="Elegir foto"
          className="no-scrollbar relative mx-5 mt-3 flex snap-x gap-2 overflow-x-auto pb-2 lg:mx-0"
        >
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              disabled={!api}
              aria-label={`Ver foto ${index + 1}`}
              aria-current={index === selected ? "true" : undefined}
              onClick={() => api?.scrollTo(index, reducedMotion)}
              className={`h-20 w-28 shrink-0 snap-start overflow-hidden rounded-lg border-2 ${index === selected ? "border-foreground" : "border-transparent opacity-65 hover:opacity-100"}`}
            >
              <img
                src={image.src}
                alt=""
                width={112}
                height={80}
                loading="lazy"
                draggable={false}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
