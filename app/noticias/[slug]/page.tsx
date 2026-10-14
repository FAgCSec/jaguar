import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { NewsCard } from "@/components/public/NewsCard";
import { buscarPosts, getPostBySlug } from "@/lib/data";
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
  const post = await getPostBySlug("noticia", slug);
  if (!post) return { title: "Noticia no encontrada" };
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

export default async function NoticiaDetalle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug("noticia", slug);
  if (!post) notFound();
  const relacionadas = (await buscarPosts({ tipo: "noticia", limite: 4 })).filter(
    (p) => p.slug !== slug,
  ).slice(0, 3);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/noticias" className="text-sm font-bold text-[#2E7D32] hover:underline">
        ← Volver a noticias
      </Link>
      <p className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide">
        {post.categoria && (
          <span className="rounded-full bg-[#1B5E20] px-3 py-1 text-white">{post.categoria}</span>
        )}
        <time className="text-[#2E7D32]">{fechaCorta(post.published_at ?? post.created_at)}</time>
      </p>
      <h1 className="mt-3 text-3xl font-extrabold leading-tight text-[#1B5E20] sm:text-4xl">
        {post.titulo}
      </h1>
      {post.extracto && (
        <p className="mt-3 text-lg text-[#1A1A1A]/75">{post.extracto}</p>
      )}
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
        className="prose-campana mt-6"
        dangerouslySetInnerHTML={{ __html: limpiarHtml(post.contenido) }}
      />
      <div className="mt-8 flex flex-wrap gap-2">
        <span className="text-sm font-bold">Compartir:</span>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(post.titulo)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[#2E7D32] px-4 py-1.5 text-sm font-bold text-white hover:bg-[#1B5E20]"
        >
          WhatsApp
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`/noticias/${post.slug}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[#1B5E20] px-4 py-1.5 text-sm font-bold text-white"
        >
          Facebook
        </a>
        <a
          href={`https://x.com/intent/tweet?text=${encodeURIComponent(post.titulo)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-black px-4 py-1.5 text-sm font-bold text-white"
        >
          X
        </a>
      </div>
      {relacionadas.length > 0 && (
        <section className="mt-12" aria-label="Noticias relacionadas">
          <h2 className="text-xl font-extrabold text-[#1B5E20]">Sigue leyendo</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {relacionadas.slice(0, 2).map((r) => (
              <NewsCard key={r.id} post={r} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
