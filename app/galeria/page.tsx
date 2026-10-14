import type { Metadata } from "next";
import { GalleryGrid } from "@/components/public/GalleryGrid";
import { getGaleria } from "@/lib/data";

export const metadata: Metadata = { title: "Galería" };
export const revalidate = 60;

export default async function GaleriaPage() {
  const imagenes = await getGaleria(60);
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-[#1B5E20]">Galería</h1>
      <p className="mt-1 text-sm text-[#1A1A1A]/70">
        Fotos de los recorridos y encuentros de campaña.
      </p>
      <div className="mt-6">
        <GalleryGrid imagenes={imagenes} />
      </div>
    </main>
  );
}
