// Funciones para traer los datos que se ven en la parte publica del sitio.
// Todas leen de Supabase. Si no hay conexion o faltan claves, devuelven vacio para no tumbar la pagina.
// Cuando esta activo el modo de prueba (NEXT_PUBLIC_MOCK_DATA=1) devuelven datos de ejemplo.
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

// Revisa si hay claves de Supabase. Sin eso no se puede consultar la base.
function sinBackend() {
  return (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Trae la configuracion general (eslogan, biografia, fotos, pdf). Solo hay una fila con id 1.
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

// Trae los numeros que salen en la barra de contadores del inicio, ordenados.
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

// Trae las ultimas noticias o columnas publicadas. Solo trae las publicadas, no los borradores.
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

// Busca un articulo por su direccion (slug) para mostrar la pagina de detalle.
// Si no existe o no esta publicado, devuelve null.
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

// Buscador de noticias y columnas. Filtra por texto, categoria y tipo.
// Se usa en las paginas de noticias y columnas con la barra de busqueda.
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
      // Se quitan % y _ para que no rompan la busqueda en la base
      const q = args.q.replace(/[%_]/g, "");
      query = query.or(`titulo.ilike.%${q}%,extracto.ilike.%${q}%`);
    }
    const { data } = await query;
    return (data as Post[]) ?? [];
  } catch {
    return [];
  }
}

// Lo publicado en los ultimos 7 dias (noticias + columnas). Se muestra como "Lo mejor de la semana" en el inicio.
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

// Trae las fotos de la galeria en orden. El limite dice cuantas traer (por defecto 12).
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

// Trae todos los testimonios para el carrusel.
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

// Trae los temas del plan con sus propuestas adentro, mas la direccion del PDF.
// Primero trae los grupos y luego busca las propuestas de esos grupos para juntarlas.
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
  // Junta las propuestas con su grupo usando un mapa por id para no perder ninguna
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
