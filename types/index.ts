export type TipoPost = "noticia" | "columna";
export type EstadoPost = "borrador" | "publicado";

export interface Post {
  id: string;
  tipo: TipoPost;
  titulo: string;
  slug: string;
  extracto: string | null;
  contenido: string; // HTML sanitizado
  imagen_url: string | null;
  categoria: string | null;
  estado: EstadoPost;
  created_at: string;
  published_at: string | null;
}

export interface GalleryImage {
  id: string;
  url: string;
  titulo: string | null;
  orden: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  nombre: string;
  municipio: string | null;
  foto_url: string | null;
  texto: string;
  orden: number;
}

export interface Stat {
  id: string;
  etiqueta: string;
  valor: string;
  icono: string | null;
  orden: number;
}

export interface ProposalGroup {
  id: string;
  tema: string;
  orden: number;
  proposals?: Proposal[];
}

export interface Proposal {
  id: string;
  group_id: string;
  titulo: string;
  descripcion: string | null;
  orden: number;
}

export interface SiteConfig {
  id: number;
  eslogan: string;
  sobre_mi: string | null; // HTML o texto largo
  sobre_mi_foto_url: string | null;
  pdf_plan_url: string | null;
  hero_imagen_url: string | null;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  nombre: string;
  whatsapp: string | null;
  email: string | null;
  municipio: string | null;
  mensaje: string;
  leido: boolean;
  created_at: string;
}
