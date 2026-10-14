"use client";

import Image from "next/image";
import { useState } from "react";
import type { Testimonial } from "@/types";

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [indice, setIndice] = useState(0);
  if (!items.length) return null;
  const actual = items[indice % items.length];

  return (
    <div className="mx-auto max-w-3xl rounded-3xl bg-[#1B5E20] p-6 text-white shadow-xl sm:p-10">
      <p aria-hidden="true" className="text-4xl text-[#C6D92E]">“</p>
      <blockquote key={actual.id} className="min-h-24 text-lg italic leading-relaxed sm:text-xl">
        {actual.texto}
      </blockquote>
      <div className="mt-5 flex items-center gap-3">
        {actual.foto_url ? (
          <Image
            src={actual.foto_url}
            alt={`Foto de ${actual.nombre}`}
            width={52}
            height={52}
            loading="lazy"
            className="h-13 w-13 rounded-full object-cover ring-2 ring-[#C6D92E]"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-13 w-13 items-center justify-center rounded-full bg-[#C6D92E] p-3 text-xl font-extrabold text-[#1B5E20]"
          >
            {actual.nombre.charAt(0)}
          </span>
        )}
        <div>
          <p className="font-bold">{actual.nombre}</p>
          {actual.municipio && (
            <p className="text-sm text-[#D4E157]">{actual.municipio}</p>
          )}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-white/70" aria-live="polite">
          {indice + 1} de {items.length}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIndice((i) => (i - 1 + items.length) % items.length)}
            aria-label="Testimonio anterior"
            className="rounded-full bg-white/10 px-4 py-2 font-bold hover:bg-[#C6D92E] hover:text-[#1B5E20]"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setIndice((i) => (i + 1) % items.length)}
            aria-label="Testimonio siguiente"
            className="rounded-full bg-white/10 px-4 py-2 font-bold hover:bg-[#C6D92E] hover:text-[#1B5E20]"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
