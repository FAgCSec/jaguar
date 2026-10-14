import Image from "next/image";
import Link from "next/link";
import { fechaCorta } from "@/lib/utils";
import type { Post } from "@/types";

export function NewsCard({ post }: { post: Post }) {
  const base = post.tipo === "columna" ? "/columnas" : "/noticias";
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`${base}/${post.slug}`} className="relative block aspect-[16/9] bg-[#e8e8dc]">
        {post.imagen_url ? (
          <Image
            src={post.imagen_url}
            alt={post.titulo}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <span aria-hidden="true" className="flex h-full items-center justify-center text-5xl">
            🌿
          </span>
        )}
        {post.categoria && (
          <span className="absolute left-3 top-3 rounded-full bg-[#1B5E20] px-3 py-1 text-xs font-bold text-white">
            {post.categoria}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <time className="text-xs font-semibold uppercase tracking-wide text-[#2E7D32]">
          {fechaCorta(post.published_at ?? post.created_at)}
        </time>
        <h3 className="text-lg font-bold leading-snug text-[#1A1A1A]">
          <Link href={`${base}/${post.slug}`} className="hover:text-[#1B5E20] hover:underline">
            {post.titulo}
          </Link>
        </h3>
        {post.extracto && (
          <p className="line-clamp-3 text-sm text-[#1A1A1A]/75">{post.extracto}</p>
        )}
        <Link
          href={`${base}/${post.slug}`}
          className="mt-auto inline-flex w-fit items-center gap-1 pt-2 text-sm font-bold text-[#2E7D32] hover:underline"
        >
          Leer más →
        </Link>
      </div>
    </article>
  );
}
