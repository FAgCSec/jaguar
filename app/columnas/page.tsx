import type { Metadata } from "next";
import { PenLine } from "lucide-react";
import { NewsCard } from "@/components/public/NewsCard";
import { SearchBar } from "@/components/public/SearchBar";
import { buscarPosts } from "@/lib/data";

// Pagina con todas las columnas de opinion. Igual que noticias pero tipo columna.
export const metadata: Metadata = { title: "Columnas de opinión" };
export const revalidate = 60;

export default async function ColumnasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}) {
  const sp = await searchParams;
  const posts = await buscarPosts({
    q: sp.q,
    categoria: sp.categoria,
    tipo: "columna",
    limite: 24,
  });
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-[#1B5E20]">Columnas de opinión</h1>
      <p className="mt-1 text-sm text-[#1A1A1A]/70">
        Textos y editoriales escritos por el candidato.
      </p>
      <div className="mt-5">
        <SearchBar />
      </div>
      {posts.length ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <NewsCard key={p.id} post={p} />
          ))}
        </div>
      ) : (
        <p className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-white p-8 text-center shadow">
          <PenLine size={20} className="shrink-0 text-[#2E7D32]" />
          No encontramos columnas con esos filtros.
        </p>
      )}
    </main>
  );
}
