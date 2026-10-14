"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Sprout, X } from "lucide-react";
import type { GalleryImage } from "@/types";

const PATRON: Record<number, string> = {
  0: "sm:col-span-2 sm:row-span-2",
  3: "sm:col-span-2",
};

export function GalleryGrid({ imagenes }: { imagenes: GalleryImage[] }) {
  const [indice, setIndice] = useState<number | null>(null);

  useEffect(() => {
    if (indice === null) return;
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIndice(null);
      if (e.key === "ArrowLeft") {
        setIndice((i) =>
          i === null ? i : (i - 1 + imagenes.length) % imagenes.length,
        );
      }
      if (e.key === "ArrowRight") {
        setIndice((i) => (i === null ? i : (i + 1) % imagenes.length));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflowPrevio;
      window.removeEventListener("keydown", onKey);
    };
  }, [indice, imagenes.length]);

  if (!imagenes.length) {
    return (
      <p className="flex items-center justify-center gap-2 rounded-2xl bg-white p-8 text-center text-[#1A1A1A]/70 shadow">
        <Sprout size={20} className="text-[#2E7D32]" />
        Muy pronto publicaremos fotos de la campaña.
      </p>
    );
  }

  const actual = indice !== null ? imagenes[indice] : null;

  return (
    <>
      <div className="grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[180px] sm:grid-cols-4 lg:auto-rows-[200px]">
        {imagenes.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setIndice(i)}
            aria-label={`Ver foto: ${img.titulo ?? `Foto de campaña ${i + 1}`}`}
            className={`group relative overflow-hidden rounded-2xl bg-[#e8e8dc] shadow ${PATRON[i % 6] ?? ""}`}
          >
            <Image
              src={img.url}
              alt={img.titulo ?? `Foto de campaña ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
            {img.titulo && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8 text-left text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">
                {img.titulo}
              </span>
            )}
          </button>
        ))}
      </div>

      {actual && indice !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visor de fotos"
          onClick={() => setIndice(null)}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4"
        >
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <button
              type="button"
              onClick={() => setIndice(null)}
              aria-label="Cerrar visor"
              className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            >
              <X size={22} />
            </button>
            <span className="text-sm font-semibold text-white">
              {indice + 1} de {imagenes.length}
            </span>
          </div>

          <div
            className="relative h-[75vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={actual.url}
              alt={actual.titulo ?? `Foto ${indice + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          {actual.titulo && (
            <p className="mt-3 max-w-2xl text-center text-sm font-semibold text-white">
              {actual.titulo}
            </p>
          )}

          <div
            className="absolute inset-y-0 left-0 flex items-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() =>
                setIndice((i) =>
                  i === null ? i : (i - 1 + imagenes.length) % imagenes.length,
                )
              }
              aria-label="Foto anterior"
              className="rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          <div
            className="absolute inset-y-0 right-0 flex items-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() =>
                setIndice((i) => (i === null ? i : (i + 1) % imagenes.length))
              }
              aria-label="Foto siguiente"
              className="rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
