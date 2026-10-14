import Link from "next/link";
import type { Metadata } from "next";
import { BadgeCheck, FileEdit, Plus, Trash2 } from "lucide-react";
import { requireAdmin } from "../layout";
import { eliminarPost } from "../posts-actions";
import type { Post } from "@/types";
import { fechaCorta } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin noticias" };

export default async function AdminNoticias({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  let q = supabase.from("posts").select("*").eq("tipo", "noticia").order("created_at", { ascending: false }).limit(100);
  if (sp.estado === "borrador" || sp.estado === "publicado") q = q.eq("estado", sp.estado);
  const { data } = await q;
  const posts = (data as Post[]) ?? [];

  return (
    <main>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-[#1B5E20]">Noticias</h1>
        <Link href="/admin/noticias/nuevo" className="inline-flex items-center gap-1.5 rounded-full bg-[#C6D92E] px-5 py-2.5 font-bold text-[#1B5E20] hover:bg-[#D4E157]">
          <Plus size={17} /> Nueva noticia
        </Link>
      </div>
      <div className="mt-3 flex gap-2 text-sm font-semibold">
        <Link href="/admin/noticias" className="rounded-full bg-white px-4 py-1.5 shadow">Todas</Link>
        <Link href="/admin/noticias?estado=publicado" className="rounded-full bg-white px-4 py-1.5 shadow">Publicadas</Link>
        <Link href="/admin/noticias?estado=borrador" className="rounded-full bg-white px-4 py-1.5 shadow">Borradores</Link>
      </div>
      <ul className="mt-4 grid gap-3">
        {posts.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow">
            <div>
              <p className="font-bold">{p.titulo}</p>
              <p className="flex items-center gap-1.5 text-xs text-[#1A1A1A]/60">
                {p.estado === "publicado"
                  ? (<><BadgeCheck size={14} className="text-[#2E7D32]" /> Publicado</>)
                  : (<><FileEdit size={14} /> Borrador</>)} · {fechaCorta(p.published_at ?? p.created_at)} · /noticias/{p.slug}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/noticias/${p.id}`} className="rounded-full bg-[#F5F5ED] px-4 py-1.5 text-sm font-bold text-[#1B5E20] ring-1 ring-[#2E7D32]/20">
                Editar
              </Link>
              <form action={eliminarPost.bind(null, p.id, "noticia")}>
                <button type="submit" className="inline-flex items-center gap-1 rounded-full bg-red-50 px-4 py-1.5 text-sm font-bold text-red-700" onClick={(e) => { if (!confirm("¿Eliminar esta noticia?")) e.preventDefault(); }}>
                  <Trash2 size={14} /> Eliminar
                </button>
              </form>
            </div>
          </li>
        ))}
        {!posts.length && <p className="rounded-2xl bg-white p-8 text-center shadow">No hay noticias. ¡Crea la primera!</p>}
      </ul>
    </main>
  );
}
