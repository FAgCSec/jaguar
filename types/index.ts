// Tipos de todo el sitio.
// Aqui definimos como son los datos que se guardan en la base (noticias, fotos, etc).
// Si cambias algo en Supabase, hay que cambiarlo aqui tambien para que no falle.

export type TipoPost = "noticia" | "columna";
// Solo hay dos opciones para un post: o es noticia o es columna. No hay mas.
export type EstadoPost = "borrador" | "publicado";
// Borrador = solo lo ve el equipo en el admin. Publicado = ya lo ve todo el mundo.

export interface Post {
  id: string;
  tipo: TipoPost;
  titulo: string;
  slug: string; // la parte final de la direccion web, ej: /noticias/mi-titulo
  extracto: string | null; // resumen corto que sale en las tarjetas
  contenido: string; // HTML sanitizado
  imagen_url: string | null;
  categoria: string | null;
  estado: EstadoPost;
  created_at: string;
  published_at: string | null;
}

export interface GalleryImage {
  // Cada foto de la galeria. El orden dice en que posicion sale (1 primero, 2 despues...).
  id: string;
  url: string;
  titulo: string | null;
  orden: number;
  created_at: string;
}

export interface Testimonial {
  // Lo que dice la gente. Se muestra en el carrusel del inicio.
  id: string;
  nombre: string;
  municipio: string | null;
  foto_url: string | null;
  texto: string;
  orden: number;
}

export interface Stat {
  // Los numeritos del inicio: ej "32 municipios visitados". Icono es el dibujito que lleva al lado.
  id: string;
  etiqueta: string;
  valor: string;
  icono: string | null;
  orden: number;
}

export interface ProposalGroup {
  // Un tema grande del plan, ej "Salud". Adentro lleva varias propuestas chicas.
  id: string;
  tema: string;
  orden: number;
  proposals?: Proposal[];
}

export interface Proposal {
  // Una propuesta suelta, siempre pertenece a un grupo (group_id dice a cual).
  id: string;
  group_id: string;
  titulo: string;
  descripcion: string | null;
  orden: number;
}

export interface SiteConfig {
  // Configuracion general del sitio. Solo hay una fila con id 1, no se crean mas.
  // Aqui se guarda el eslogan, la biografia, la foto y el pdf del plan.
  id: number;
  eslogan: string;
  sobre_mi: string | null; // HTML o texto largo
  sobre_mi_foto_url: string | null;
  pdf_plan_url: string | null;
  hero_imagen_url: string | null;
  updated_at: string;
}

export interface ContactMessage {
  // Mensajes que deja la gente en el formulario de contacto / voluntarios.
  // Leido sirve para saber si ya se atendio o sigue pendiente.
  id: string;
  nombre: string;
  whatsapp: string | null;
  email: string | null;
  municipio: string | null;
  mensaje: string;
  leido: boolean;
  created_at: string;
}
