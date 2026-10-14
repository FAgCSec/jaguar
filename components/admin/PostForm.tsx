import { CATEGORIAS_NOTICIAS } from "@/lib/constants";
import type { Post } from "@/types";
import { RichTextEditor } from "./RichTextEditor";
import { ImageUploader } from "./Uploaders";

/** Formulario compartido para noticias y columnas (crear + editar + vista previa). */
export function PostForm({
  post,
  tipo,
  action,
  error,
}: {
  post?: Post | null;
  tipo: "noticia" | "columna";
  action: (fd: FormData) => Promise<void>;
  error?: string;
}) {
  return (
    <form action={action} className="grid max-w-4xl gap-5">
      <div className="grid gap-4 rounded-2xl bg-white p-5 shadow sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold sm:col-span-2">
          Título *
          <input
            name="titulo"
            required
            maxLength={160}
            defaultValue={post?.titulo ?? ""}
            placeholder={tipo === "columna" ? "Título de la columna" : "Título de la noticia"}
            className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal outline-none ring-1 ring-[#2E7D32]/15 focus:ring-2 focus:ring-[#2E7D32]"
          />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Slug (URL limpia)
          <input
            name="slug"
            maxLength={140}
            defaultValue={post?.slug ?? ""}
            placeholder="se-genera-del-titulo"
            className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal outline-none ring-1 ring-[#2E7D32]/15 focus:ring-2 focus:ring-[#2E7D32]"
          />
          <span className="text-xs font-normal text-[#1A1A1A]/60">
            Vacío = se genera solo del título.
          </span>
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Categoría
          <select
            name="categoria"
            defaultValue={post?.categoria ?? ""}
            className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal outline-none ring-1 ring-[#2E7D32]/15"
          >
            <option value="">Sin categoría</option>
            {CATEGORIAS_NOTICIAS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold sm:col-span-2">
          Extracto (resumen para tarjetas y redes)
          <textarea
            name="extracto"
            rows={2}
            maxLength={300}
            defaultValue={post?.extracto ?? ""}
            placeholder="1-2 frases que inviten a leer…"
            className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal outline-none ring-1 ring-[#2E7D32]/15 focus:ring-2 focus:ring-[#2E7D32]"
          />
        </label>
        <div className="sm:col-span-2">
          <p className="mb-1 text-sm font-semibold">Imagen de portada</p>
          <ImageUploader name="imagen_url" initialUrl={post?.imagen_url ?? ""} carpeta={tipo === "columna" ? "columnas" : "noticias"} />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow">
        <p className="mb-2 text-sm font-semibold">Cuerpo del artículo *</p>
        <RichTextEditor name="contenido" initialValue={post?.contenido ?? ""} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          name="estado"
          value="borrador"
          className="rounded-full border-2 border-[#1B5E20] px-6 py-2.5 font-bold text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white"
        >
          Guardar borrador
        </button>
        <button
          type="submit"
          name="estado"
          value="publicado"
          className="rounded-full bg-[#C6D92E] px-6 py-2.5 font-bold text-[#1B5E20] shadow hover:bg-[#D4E157]"
        >
          Publicar
        </button>
        {post?.slug && (
          <a
            href={`/${tipo === "columna" ? "columnas" : "noticias"}/${post.slug}?vista-previa=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#2E7D32] hover:underline"
          >
            👁 Vista previa
          </a>
        )}
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
    </form>
  );
}
