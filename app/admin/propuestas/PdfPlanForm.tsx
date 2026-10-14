"use client";

import { useState } from "react";
import { CircleCheck, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { validarArchivo } from "@/lib/utils";
import { guardarPdfPlan } from "../gestion-actions";

// Sube el PDF del plan completo. Primero lo sube a Supabase y luego guarda la direccion.
// Deja ver el PDF actual y reemplazarlo cuando haya nueva version.
export function PdfPlanForm({ inicial }: { inicial: string }) {
  const [url, setUrl] = useState(inicial);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  async function subir(file: File) {
    if (file.type !== "application/pdf" || file.size > 5 * 1024 * 1024) {
      setError("Solo PDF de máximo 5 MB.");
      return;
    }
    setError("");
    setSubiendo(true);
    try {
      const supabase = createClient();
      const ruta = `plan/${Date.now()}-plan-de-gobierno.pdf`;
      const { error: upErr } = await supabase.storage.from("documentos").upload(ruta, file, {
        contentType: "application/pdf",
        upsert: true,
      });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("documentos").getPublicUrl(ruta);
      setUrl(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir.");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <form
      action={async () => {
        const fd = new FormData();
        fd.set("pdf_plan_url", url);
        const r = await guardarPdfPlan(fd);
        setOk(!r?.error);
        if (r?.error) setError(r.error);
      }}
      className="grid gap-3 rounded-2xl bg-white p-5 shadow"
    >
      <p className="flex items-center gap-2 font-bold"><FileText size={18} className="text-[#2E7D32]" /> PDF del plan completo</p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-full bg-[#1B5E20] px-4 py-2 text-sm font-bold text-white hover:bg-[#2E7D32]">
          {subiendo ? "Subiendo…" : url ? "Reemplazar PDF" : "Subir PDF"}
          <input type="file" accept="application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) subir(f); }} />
        </label>
        {url && <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#2E7D32] hover:underline">Ver PDF actual</a>}
      </div>
      {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
      {ok && <p role="status" className="flex items-center gap-1.5 text-sm font-semibold text-[#1B5E20]"><CircleCheck size={16} /> PDF guardado.</p>}
      <button type="submit" disabled={!url || subiendo} className="w-fit rounded-full bg-[#1B5E20] px-5 py-2 font-bold text-white hover:bg-[#2E7D32] disabled:opacity-50">
        Guardar PDF
      </button>
    </form>
  );
}

// Esta linea es para no dañar otros archivos que importaban validarArchivo desde aqui.
// Mejor importar desde lib/utils, pero se deja por compatibilidad.
export { validarArchivo };
