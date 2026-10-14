"use client";

import { useState } from "react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploader } from "@/components/admin/Uploaders";
import { guardarConfig } from "../gestion-actions";

export function SobreMiForm({
  inicial,
}: {
  inicial: { eslogan: string; sobre_mi: string; foto: string; hero: string };
}) {
  const [foto, setFoto] = useState(inicial.foto);
  const [hero, setHero] = useState(inicial.hero);
  const [ok, setOk] = useState(false);

  return (
    <form
      action={async (fd) => {
        fd.set("sobre_mi_foto_url", foto);
        fd.set("hero_imagen_url", hero);
        const r = await guardarConfig(fd);
        setOk(!r?.error);
      }}
      className="grid max-w-4xl gap-5"
    >
      <div className="grid gap-4 rounded-2xl bg-white p-5 shadow">
        <label className="grid gap-1 text-sm font-semibold">
          Eslogan de campaña
          <input
            name="eslogan"
            maxLength={160}
            defaultValue={inicial.eslogan}
            className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal outline-none ring-1 ring-[#2E7D32]/15"
          />
        </label>
        <div>
          <p className="mb-1 text-sm font-semibold">Foto del candidato (Sobre mí)</p>
          <ImageUploader name="__foto" initialUrl={foto} carpeta="candidato" onUrl={setFoto} />
        </div>
        <div>
          <p className="mb-1 text-sm font-semibold">Imagen del hero (portada principal)</p>
          <ImageUploader name="__hero" initialUrl={hero} carpeta="hero" onUrl={setHero} />
        </div>
      </div>
      <div className="rounded-2xl bg-white p-5 shadow">
        <p className="mb-2 text-sm font-semibold">Biografía</p>
        <RichTextEditor name="sobre_mi" initialValue={inicial.sobre_mi} />
      </div>
      <button type="submit" className="w-fit rounded-full bg-[#1B5E20] px-6 py-2.5 font-bold text-white hover:bg-[#2E7D32]">
        Guardar cambios
      </button>
      {ok && <p role="status" className="text-sm font-semibold text-[#1B5E20]">✅ Guardado.</p>}
    </form>
  );
}
