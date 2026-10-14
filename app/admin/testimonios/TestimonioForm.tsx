"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/admin/Uploaders";
import { guardarTestimonio } from "../gestion-actions";
import type { Testimonial } from "@/types";

export function TestimonioForm({ inicial }: { inicial?: Testimonial | null }) {
  const [abierto, setAbierto] = useState(!!inicial);
  if (!abierto && inicial) {
    return (
      <button type="button" onClick={() => setAbierto(true)} className="rounded-full bg-[#F5F5ED] px-4 py-1.5 text-sm font-bold text-[#1B5E20] ring-1 ring-[#2E7D32]/20">
        Editar
      </button>
    );
  }
  if (!abierto) {
    return (
      <button type="button" onClick={() => setAbierto(true)} className="rounded-full bg-[#C6D92E] px-5 py-2.5 font-bold text-[#1B5E20]">
        ➕ Nuevo testimonio
      </button>
    );
  }
  return (
    <form
      action={async (fd) => {
        await guardarTestimonio(fd);
        if (!inicial) setAbierto(false);
      }}
      className="grid gap-3 rounded-2xl bg-white p-5 shadow"
    >
      <input type="hidden" name="id" value={inicial?.id ?? ""} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold">
          Nombre *
          <input name="nombre" required maxLength={120} defaultValue={inicial?.nombre ?? ""} className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal outline-none ring-1 ring-[#2E7D32]/15" />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Municipio
          <input name="municipio" maxLength={80} defaultValue={inicial?.municipio ?? ""} className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal outline-none ring-1 ring-[#2E7D32]/15" />
        </label>
      </div>
      <label className="grid gap-1 text-sm font-semibold">
        Texto del testimonio *
        <textarea name="texto" required rows={3} maxLength={600} defaultValue={inicial?.texto ?? ""} className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal outline-none ring-1 ring-[#2E7D32]/15" />
      </label>
      <div>
        <p className="mb-1 text-sm font-semibold">Foto (opcional)</p>
        <ImageUploader name="foto_url" initialUrl={inicial?.foto_url ?? ""} carpeta="testimonios" />
      </div>
      <label className="grid gap-1 text-sm font-semibold">
        Orden
        <input name="orden" type="number" defaultValue={inicial?.orden ?? 0} className="w-28 rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal outline-none ring-1 ring-[#2E7D32]/15" />
      </label>
      <div className="flex gap-2">
        <button type="submit" className="rounded-full bg-[#1B5E20] px-5 py-2 font-bold text-white hover:bg-[#2E7D32]">
          Guardar
        </button>
        <button type="button" onClick={() => setAbierto(false)} className="rounded-full bg-[#F5F5ED] px-5 py-2 font-bold">
          Cancelar
        </button>
      </div>
    </form>
  );
}
