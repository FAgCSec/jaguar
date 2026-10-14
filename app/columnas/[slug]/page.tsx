import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/data";
import { limpiarHtml } from "@/lib/sanitize";
import { SITE } from "@/lib/constants";
import { fechaCorta } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug("columna", slug);
  if (!post) return { title: "Columna no encontrada" };
  return {
    title: post.titulo,
    description: post.extracto ?? SITE.descripcion,
    openGraph: {
      title: post.titulo,
      description: post.extracto ?? SITE.descripcion,
      type: "article",
      images: post.imagen_url ? [post.imagen_url] : [],
    },
  };
}

export default async function ColumnaDetalle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug("columna", slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/columnas" className="text-sm font-bold text-[#2E7D32] hover:underline">
        ← Volver a columnas
      </Link>
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#2E7D32]">
        Columna de opinión · {fechaCorta(post.published_at ?? post.created_at)}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold leading-tight text-[#1B5E20] sm:text-4xl">
        {post.titulo}
      </h1>
      <p className="mt-3 flex items-center gap-2 text-sm font-semibold">
        <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C6D92E] font-extrabold text-[#1B5E20]">
          {SITE.candidatoCorto.charAt(0)}
        </span>
        Por {SITE.candidato}
      </p>
      {post.imagen_url && (
        <Image
          src={post.imagen_url}
          alt={post.titulo}
          width={1200}
          height={675}
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="mt-6 w-full rounded-2xl object-cover shadow-lg"
        />
      )}
      <div
        className="prose-campana mt-6 text-lg"
        dangerouslySetInnerHTML={{ __html: limpiarHtml(post.contenido) }}
      />
    </main>
  );
}
