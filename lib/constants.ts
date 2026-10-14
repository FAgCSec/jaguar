// ============================================================
// Datos generales del sitio. Si hay que cambiar nombre, telefono,
// redes o colores, se hace aqui y se refleja en todas las paginas.
// No hay que buscar en otros archivos.
// ============================================================

export const SITE = {
  // Nombre y datos del candidato. Cambiar aqui cuando sea necesario.
  candidato: "Nombre del Candidato", // ← CAMBIAR: nombre completo
  candidatoCorto: "Candidato", // ← CAMBIAR: nombre corto para el logo
  eslogan: "La selva florece con trabajo honesto", // ← CAMBIAR: eslogan de campaña
  departamento: "Nuestro Departamento", // ← CAMBIAR
  cargo: "Candidato a la Gobernación",
  descripcion:
    // Este texto sale en Google y al compartir el enlace en WhatsApp.
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

// Colores del sitio (verde selva, amarillo lima, fondo crema).
// Si se quieren cambiar, tambien hay que mirar app/globals.css que tiene los mismos tonos.
export const COLORS = {
  verdeOscuro: "#1B5E20",
  verdeSelva: "#2E7D32",
  lima: "#C6D92E",
  limaClaro: "#D4E157",
  crema: "#F5F5ED",
  texto: "#1A1A1A",
} as const;

// Enlaces que salen en el menu de arriba y en el pie de pagina. Agregar o quitar aqui.
export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/noticias", label: "Noticias" },
  { href: "/columnas", label: "Columnas de opinión" },
  { href: "/galeria", label: "Galería" },
  { href: "/propuestas", label: "Propuestas" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/contacto", label: "Contacto" },
] as const;

// Categorias disponibles al crear una noticia. Salen en el filtro de busqueda.
export const CATEGORIAS_NOTICIAS = [
  "Campaña",
  "Territorio",
  "Propuestas",
  "Comunidad",
  "Prensa",
] as const;

// Reglas para subir archivos: peso maximo y que tipos de imagen se aceptan.
export const UPLOAD = {
  maxBytes: 5 * 1024 * 1024,
  imagenesAceptadas: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  extensionesAceptadas: [".jpg", ".jpeg", ".png", ".webp", ".avif"],
} as const;
