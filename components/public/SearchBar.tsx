"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIAS_NOTICIAS } from "@/lib/constants";

export function SearchBar({ mostrarTipo = false }: { mostrarTipo?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function actualizar(name: string, value: string) {
    const sp = new URLSearchParams(params.toString());
    if (value) sp.set(name, value);
    else sp.delete(name);
    router.push(`${pathname}?${sp.toString()}`, { scroll: false });
  }

  return (
    <form
      role="search"
      aria-label="Buscar contenido"
      className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-md sm:flex-row sm:items-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <label className="flex flex-1 items-center gap-2 rounded-full bg-[#F5F5ED] px-4 py-2.5 ring-1 ring-[#2E7D32]/15">
        <span aria-hidden="true">🔍</span>
        <span className="sr-only">Buscar por texto</span>
        <input
          type="search"
          placeholder="Buscar noticias y columnas…"
          defaultValue={params.get("q") ?? ""}
          onChange={(e) => actualizar("q", e.target.value)}
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#1A1A1A]/50"
        />
      </label>
      <label className="flex items-center gap-2 rounded-full bg-[#F5F5ED] px-4 py-2.5 text-sm ring-1 ring-[#2E7D32]/15">
        <span className="sr-only">Filtrar por categoría</span>
        <select
          defaultValue={params.get("categoria") ?? ""}
          onChange={(e) => actualizar("categoria", e.target.value)}
          className="bg-transparent font-semibold outline-none"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS_NOTICIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      {mostrarTipo && (
        <label className="flex items-center gap-2 rounded-full bg-[#F5F5ED] px-4 py-2.5 text-sm ring-1 ring-[#2E7D32]/15">
          <span className="sr-only">Filtrar por tipo</span>
          <select
            defaultValue={params.get("tipo") ?? ""}
            onChange={(e) => actualizar("tipo", e.target.value)}
            className="bg-transparent font-semibold outline-none"
          >
            <option value="">Noticias + columnas</option>
            <option value="noticia">Noticias</option>
            <option value="columna">Columnas</option>
          </select>
        </label>
      )}
    </form>
  );
}
