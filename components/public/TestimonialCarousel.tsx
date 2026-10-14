import Image from "next/image";
import type { Testimonial } from "@/types";

/**
 * Testimonios en cinta que se desplaza sola (bucle infinito).
 * Se pausa al pasar el mouse y respeta "reducir movimiento" del sistema.
 */
export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  const doble = [...items, ...items];

  return (
    <div className="marquee overflow-hidden" aria-label="Testimonios de la comunidad">
      <div className="marquee-track flex gap-4">
        {doble.map((t, i) => (
          <figure
            key={`${t.id}-${i}`}
            aria-hidden={i >= items.length}
            className="flex w-72 shrink-0 items-start gap-3 rounded-2xl bg-white p-4 shadow-md ring-1 ring-[#2E7D32]/10"
          >
            {t.foto_url ? (
              <Image
                src={t.foto_url}
                alt=""
                width={44}
                height={44}
                loading="lazy"
                className="h-11 w-11 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C6D92E] text-lg font-extrabold text-[#1B5E20]"
              >
                {t.nombre.charAt(0)}
              </span>
            )}
            <div className="min-w-0">
              <blockquote className="text-sm leading-snug text-[#1A1A1A]/85">
                {t.texto}
              </blockquote>
              <figcaption className="mt-2 text-xs font-bold text-[#1B5E20]">
                {t.nombre}
                {t.municipio && (
                  <span className="font-semibold text-[#1A1A1A]/55"> · {t.municipio}</span>
                )}
              </figcaption>
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
}
