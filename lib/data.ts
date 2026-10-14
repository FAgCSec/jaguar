import { createClient } from "@/lib/supabase/server";
import {
  MOCK,
  MOCK_CONFIG,
  MOCK_GALERIA,
  MOCK_GRUPOS,
  MOCK_POSTS,
  MOCK_STATS,
  MOCK_TESTIMONIOS,
} from "@/lib/mock-data";
import type {
  GalleryImage,
  Post,
  ProposalGroup,
  SiteConfig,
  Stat,
  Testimonial,
} from "@/types";

/** Sin credenciales (build local, CI) devolvemos vacíos en vez de romper. */
function sinBackend() {
  return (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function getConfig(): Promise<SiteConfig | null> {
  if (MOCK) return MOCK_CONFIG;
  if (sinBackend()) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_config")
      .select("*")
      .eq("id", 1)
      .single();
    return (data as SiteConfig | null) ?? null;
  } catch {
    return null;
  }
}

export async function getStats(): Promise<Stat[]> {
  if (MOCK) return MOCK_STATS;
  if (sinBackend()) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("stats")
      .select("*")
      .order("orden", { ascending: true });
    return (data as Stat[]) ?? [];
  } catch {
    return [];
  }
}

export async function getPosts(
  tipo: "noticia" | "columna",
  limite = 6,
): Promise<Post[]> {
  if (MOCK) {
    return MOCK_POSTS.filter((p) => p.tipo === tipo)
      .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""))
      .slice(0, limite);
  }
  if (sinBackend()) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("tipo", tipo)
      .eq("estado", "publicado")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limite);
    return (data as Post[]) ?? [];
  } catch {
    return [];
  }
}

export async function getPostBySlug(
  tipo: "noticia" | "columna",
  slug: string,
): Promise<Post | null> {
  if (MOCK) {
    return MOCK_POSTS.find((p) => p.tipo === tipo && p.slug === slug) ?? null;
  }
  if (sinBackend()) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("tipo", tipo)
      .eq("slug", slug)
      .eq("estado", "publicado")
      .single();
    return (data as Post | null) ?? null;
  } catch {
    return null;
  }
}

export async function buscarPosts(args: {
  q?: string;
  categoria?: string;
  tipo?: string;
  limite?: number;
}): Promise<Post[]> {
  if (MOCK) {
    const q = (args.q ?? "").toLowerCase();
    return MOCK_POSTS.filter(
      (p) =>
        (args.tipo === "noticia" || args.tipo === "columna"
          ? p.tipo === args.tipo
          : true) &&
        (!args.categoria || p.categoria === args.categoria) &&
        (!q ||
          p.titulo.toLowerCase().includes(q) ||
          (p.extracto ?? "").toLowerCase().includes(q)),
    )
      .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""))
      .slice(0, args.limite ?? 24);
  }
  if (sinBackend()) return [];
  try {
    const supabase = await createClient();
    let query = supabase
      .from("posts")
      .select("*")
      .eq("estado", "publicado")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(args.limite ?? 24);
    if (args.tipo === "noticia" || args.tipo === "columna") {
      query = query.eq("tipo", args.tipo);
    }
    if (args.categoria) {
      query = query.eq("categoria", args.categoria);
    }
    if (args.q) {
      const q = args.q.replace(/[%_]/g, "");
      query = query.or(`titulo.ilike.%${q}%,extracto.ilike.%${q}%`);
    }
    const { data } = await query;
    return (data as Post[]) ?? [];
  } catch {
    return [];
  }
}

/** Lo publicado en los últimos 7 días (noticias + columnas) para "Lo mejor de la semana". */
export async function getLoMejorDeLaSemana(limite = 3): Promise<Post[]> {
  if (MOCK) {
    const desde = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    return MOCK_POSTS.filter((p) => (p.published_at ?? "") >= desde)
      .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""))
      .slice(0, limite);
  }
  if (sinBackend()) return [];
  try {
    const supabase = await createClient();
    const desde = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("estado", "publicado")
      .gte("published_at", desde)
      .order("published_at", { ascending: false })
      .limit(limite);
    return (data as Post[]) ?? [];
  } catch {
    return [];
  }
}

export async function getGaleria(limite = 12): Promise<GalleryImage[]> {
  if (MOCK) return MOCK_GALERIA.slice(0, limite);
  if (sinBackend()) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .order("orden", { ascending: true })
      .limit(limite);
    return (data as GalleryImage[]) ?? [];
  } catch {
    return [];
  }
}

export async function getTestimonios(): Promise<Testimonial[]> {
  if (MOCK) return MOCK_TESTIMONIOS;
  if (sinBackend()) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("orden", { ascending: true });
    return (data as Testimonial[]) ?? [];
  } catch {
    return [];
  }
}

export async function getPropuestas(): Promise<{
  grupos: ProposalGroup[];
  pdfUrl: string | null;
}> {
  if (MOCK) return { grupos: MOCK_GRUPOS, pdfUrl: null };
  if (sinBackend()) return { grupos: [], pdfUrl: null };
  try {
    const supabase = await createClient();
    const [{ data: grupos }, { data: config }] = await Promise.all([
      supabase.from("proposal_groups").select("*").order("orden"),
      supabase.from("site_config").select("pdf_plan_url").eq("id", 1).single(),
    ]);
    const lista = (grupos as ProposalGroup[]) ?? [];
    if (!lista.length) return { grupos: [], pdfUrl: (config as { pdf_plan_url: string | null } | null)?.pdf_plan_url ?? null };
    const { data: props } = await supabase
      .from("proposals")
      .select("*")
      .in(
        "group_id",
        lista.map((g) => g.id),
      )
      .order("orden");
    const porGrupo = new Map<string, ProposalGroup>();
    lista.forEach((g) => porGrupo.set(g.id, { ...g, proposals: [] }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((props as any[]) ?? []).forEach((p) => {
      porGrupo.get(p.group_id)?.proposals?.push(p);
    });
    return {
      grupos: [...porGrupo.values()],
      pdfUrl: (config as { pdf_plan_url: string | null } | null)?.pdf_plan_url ?? null,
    };
  } catch {
    return { grupos: [], pdfUrl: null };
  }
}
