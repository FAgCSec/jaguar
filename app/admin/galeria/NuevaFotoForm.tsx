"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { validarArchivo } from "@/lib/utils";
import { agregarFoto } from "../gestion-actions";

export function NuevaFotoForm() {
  const [url, setUrl] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  async function subir(file: File) {
    const v = validarArchivo(file);
    if (!v.ok) {
      setError(v.error ?? "Archivo no válido.");
      return;
    }
    setError("");
    setSubiendo(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const ruta = `galeria/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("imagenes").upload(ruta, file, {
        contentType: file.type,
        upsert: false,
      });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("imagenes").getPublicUrl(ruta);
      setUrl(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir.");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <form
      action={async (fd) => {
        fd.set("url", url);
        const r = await agregarFoto(fd);
        if (!r?.error) setUrl("");
        else setError(r.error);
      }}
      className="grid gap-3 rounded-2xl bg-white p-5 shadow"
    >
      <p className="font-bold text-[#1B5E20]">Subir foto</p>
      <div className="flex flex-wrap items-center gap-3">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="Vista previa" className="h-24 w-32 rounded-xl object-cover shadow" />
        ) : (
          <span className="flex h-24 w-32 items-center justify-center rounded-xl bg-[#F5F5ED] text-3xl">🖼️</span>
        )}
        <label className="cursor-pointer rounded-full bg-[#1B5E20] px-4 py-2 text-sm font-bold text-white hover:bg-[#2E7D32]">
          {subiendo ? "Subiendo…" : url ? "Cambiar foto" : "Elegir foto"}
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.avif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) subir(f);
            }}
          />
        </label>
      </div>
      <label className="grid gap-1 text-sm font-semibold">
        Título (opcional)
        <input
          name="titulo"
          maxLength={120}
          placeholder="Ej. Encuentro en San José"
          className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal outline-none ring-1 ring-[#2E7D32]/15"
        />
      </label>
      <button
        type="submit"
        disabled={!url || subiendo}
        className="w-fit rounded-full bg-[#1B5E20] px-5 py-2 font-bold text-white hover:bg-[#2E7D32] disabled:opacity-50"
      >
        Agregar a la galería
      </button>
      {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
    </form>
  );
}
