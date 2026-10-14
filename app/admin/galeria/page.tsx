import { requireAdmin } from "../layout";
import { eliminarFoto, reordenarFoto } from "../gestion-actions";
import { NuevaFotoForm } from "./NuevaFotoForm";
import { ArrowDown, ArrowUp, Camera, X } from "lucide-react";
import type { GalleryImage } from "@/types";

export default async function AdminGaleria() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("gallery_images").select("*").order("orden").limit(200);
  const fotos = (data as GalleryImage[]) ?? [];

  return (
    <main className="grid gap-5">
      <h1 className="text-2xl font-extrabold text-[#1B5E20]">Galería</h1>
      <NuevaFotoForm />
      <ul className="grid gap-3 sm:grid-cols-2">
        {fotos.map((f, i) => (
          <li key={f.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.url} alt={f.titulo ?? `Foto ${i + 1}`} className="h-16 w-20 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{f.titulo || `Foto ${i + 1}`}</p>
              <p className="text-xs text-[#1A1A1A]/60">Orden {f.orden}</p>
            </div>
            <div className="flex gap-1">
              <form action={reordenarFoto.bind(null, f.id, "up")}>
                <button type="submit" aria-label="Subir orden" className="rounded-lg bg-[#F5F5ED] p-1.5"><ArrowUp size={16} /></button>
              </form>
              <form action={reordenarFoto.bind(null, f.id, "down")}>
                <button type="submit" aria-label="Bajar orden" className="rounded-lg bg-[#F5F5ED] p-1.5"><ArrowDown size={16} /></button>
              </form>
              <form action={eliminarFoto.bind(null, f.id)}>
                <button type="submit" aria-label="Eliminar" className="rounded-lg bg-red-50 p-1.5 text-red-700" onClick={(e) => { if (!confirm("¿Eliminar esta foto?")) e.preventDefault(); }}><X size={16} /></button>
              </form>
            </div>
          </li>
        ))}
      </ul>
      {!fotos.length && <p className="flex items-center justify-center gap-2 rounded-2xl bg-white p-8 text-center shadow"><Camera size={20} className="text-[#2E7D32]" /> Sube la primera foto de campaña.</p>}
    </main>
  );
}
