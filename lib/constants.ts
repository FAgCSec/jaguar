// ============================================================
// 📌 CONFIGURACIÓN CENTRAL DEL CANDIDATO
// 👉 CAMBIA AQUÍ el nombre, eslogan, colores y redes sociales.
// Todo el sitio (header, hero, footer, SEO) lee de este archivo.
// ============================================================

export const SITE = {
  candidato: "Nombre del Candidato", // ← CAMBIAR: nombre completo
  candidatoCorto: "Candidato", // ← CAMBIAR: nombre corto para el logo
  eslogan: "La selva florece con trabajo honesto", // ← CAMBIAR: eslogan de campaña
  departamento: "Nuestro Departamento", // ← CAMBIAR
  cargo: "Candidato a la Gobernación",
  descripcion:
    "Sitio oficial de campaña: noticias, columnas de opinión, propuestas y actividades del candidato a la gobernación.",
  email: "contacto@ejemplo.com", // ← CAMBIAR
  whatsapp: "3000000000", // ← CAMBIAR: solo números, para enlaces wa.me
  telefonoMostrado: "+57 300 000 0000", // ← CAMBIAR
  direccion: "Sede de campaña, Calle Principal #1-23", // ← CAMBIAR
  redes: {
    facebook: "https://facebook.com/tu-pagina", // ← CAMBIAR
    x: "https://x.com/tu-cuenta", // ← CAMBIAR
    instagram: "https://instagram.com/tu-cuenta", // ← CAMBIAR
    youtube: "https://youtube.com/@tu-canal", // ← CAMBIAR
    tiktok: "https://tiktok.com/@tu-cuenta", // ← CAMBIAR
  },
} as const;

// Paleta selva / campesina (ver README para cambiarla)
export const COLORS = {
  verdeOscuro: "#1B5E20",
  verdeSelva: "#2E7D32",
  lima: "#C6D92E",
  limaClaro: "#D4E157",
  crema: "#F5F5ED",
  texto: "#1A1A1A",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/noticias", label: "Noticias" },
  { href: "/columnas", label: "Columnas de opinión" },
  { href: "/galeria", label: "Galería" },
  { href: "/propuestas", label: "Propuestas" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const CATEGORIAS_NOTICIAS = [
  "Campaña",
  "Territorio",
  "Propuestas",
  "Comunidad",
  "Prensa",
] as const;

// Límites de subida (5 MB, solo imágenes + PDF para el plan)
export const UPLOAD = {
  maxBytes: 5 * 1024 * 1024,
  imagenesAceptadas: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  extensionesAceptadas: [".jpg", ".jpeg", ".png", ".webp", ".avif"],
} as const;
