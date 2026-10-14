import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

// Mapa del sitio para Google: lista las paginas fijas mas cada noticia y columna publicada.
// Si falla la base, al menos devuelve las fijas para no dejar vacio.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const estaticas = ["", "/noticias", "/columnas", "/galeria", "/propuestas", "/sobre-mi", "/contacto"].map(
    (ruta) => ({ url: `${base}${ruta}`, lastModified: new Date() }),
  );
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("slug, tipo, published_at")
      .eq("estado", "publicado")
      .limit(200);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dinamicas = ((data as any[]) ?? []).map((p) => ({
      url: `${base}/${p.tipo === "columna" ? "columnas" : "noticias"}/${p.slug}`,
      lastModified: p.published_at ? new Date(p.published_at) : new Date(),
    }));
    return [...estaticas, ...dinamicas];
  } catch {
    return estaticas;
  }
}
