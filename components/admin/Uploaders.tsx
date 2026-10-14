"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { validarArchivo } from "@/lib/utils";

function nombreUnico(original: string, carpeta: string) {
  const ext = original.split(".").pop()?.toLowerCase() ?? "jpg";
  const base = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${carpeta}/${base}.${ext}`;
}

/** Sube una imagen a Supabase Storage (bucket `imagenes`) y devuelve su URL. */
export function ImageUploader({
  name,
  initialUrl = "",
  carpeta = "campana",
  onUrl,
}: {
  name: string;
  initialUrl?: string;
  carpeta?: string;
  onUrl?: (url: string) => void;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  function fijar(nueva: string) {
    setUrl(nueva);
    onUrl?.(nueva);
  }

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const v = validarArchivo(file);
    if (!v.ok) {
      setError(v.error ?? "Archivo no válido.");
      return;
    }
    setError("");
    setSubiendo(true);
    try {
      const supabase = createClient();
      const ruta = nombreUnico(file.name, carpeta);
      const { error: upErr } = await supabase.storage
        .from("imagenes")
        .upload(ruta, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("imagenes").getPublicUrl(ruta);
      fijar(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen.");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-3">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="Vista previa" className="h-24 w-32 rounded-xl object-cover shadow" />
        ) : (
          <span className="flex h-24 w-32 items-center justify-center rounded-xl bg-[#F5F5ED] text-3xl">
            🖼️
          </span>
        )}
        <label className="cursor-pointer rounded-full bg-[#1B5E20] px-4 py-2 text-sm font-bold text-white hover:bg-[#2E7D32]">
          {subiendo ? "Subiendo…" : url ? "Cambiar imagen" : "Subir imagen"}
          <input type="file" accept=".jpg,.jpeg,.png,.webp,.avif" onChange={onChange} className="hidden" />
        </label>
        {url && (
          <button type="button" onClick={() => fijar("")} className="text-sm font-bold text-red-700 hover:underline">
            Quitar
          </button>
        )}
      </div>
      <input type="hidden" name={name} value={url} />
      <p className="text-xs text-[#1A1A1A]/60">JPG, PNG, WebP o AVIF · máximo 5 MB.</p>
      {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
    </div>
  );
}

/** Sube el PDF del plan de gobierno (bucket `documentos`). */
export function PdfUploader({ name, initialUrl = "" }: { name: string; initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const v = validarArchivo(file, { permitirPdf: true });
    if (!v.ok || file.type !== "application/pdf") {
      setError("Solo PDF de máximo 5 MB.");
      return;
    }
    setError("");
    setSubiendo(true);
    try {
      const supabase = createClient();
      const ruta = `plan/${Date.now()}-plan-de-gobierno.pdf`;
      const { error: upErr } = await supabase.storage
        .from("documentos")
        .upload(ruta, file, { contentType: "application/pdf", upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("documentos").getPublicUrl(ruta);
      setUrl(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir el PDF.");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-full bg-[#1B5E20] px-4 py-2 text-sm font-bold text-white hover:bg-[#2E7D32]">
          {subiendo ? "Subiendo…" : url ? "Reemplazar PDF" : "Subir PDF"}
          <input type="file" accept="application/pdf" onChange={onChange} className="hidden" />
        </label>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#2E7D32] hover:underline">
            Ver PDF actual
          </a>
        )}
      </div>
      <input type="hidden" name={name} value={url} />
      {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
    </div>
  );
}
