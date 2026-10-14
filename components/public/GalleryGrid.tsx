import Image from "next/image";
import type { GalleryImage } from "@/types";

export function GalleryGrid({ imagenes }: { imagenes: GalleryImage[] }) {
  if (!imagenes.length) {
    return (
      <p className="rounded-2xl bg-white p-8 text-center text-[#1A1A1A]/70 shadow">
        Muy pronto publicaremos fotos de la campaña. 🌱
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {imagenes.map((img, i) => (
        <figure
          key={img.id}
          className={
            "group relative overflow-hidden rounded-2xl bg-[#e8e8dc] shadow " +
            (i % 7 === 0 ? "col-span-2 row-span-2" : "")
          }
        >
          <Image
            src={img.url}
            alt={img.titulo ?? `Foto de campaña ${i + 1}`}
            width={800}
            height={600}
            loading="lazy"
            sizes="(max-width: 640px) 50vw, 33vw"
            className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
          />
          {img.titulo && (
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8 text-sm font-semibold text-white">
              {img.titulo}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
