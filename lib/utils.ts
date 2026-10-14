import { clsx, type ClassValue } from "clsx";

// Junta clases de CSS y quita las que sobran. Se usa para armar los estilos segun el estado (activo, abierto, etc).
export function cn(...inputs: ClassValue[]) {
  return clsx(...inputs);
}

// Convierte un titulo en una direccion web limpia. Ej: "Hola Mundo!" -> "hola-mundo".
// Quita tildes, espacios y simbolos raros. Maximo 120 letras.
export function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

// Muestra la fecha larga en español, ej: "5 de mayo de 2026". Siempre hora de Colombia.
export function formatoFecha(fechaISO: string | null): string {
  if (!fechaISO) return "";
  const d = new Date(fechaISO);
  return d.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Bogota",
  });
}

// Fecha corta para las tarjetas, ej: "05 may 2026".
export function fechaCorta(fechaISO: string | null): string {
  if (!fechaISO) return "";
  const d = new Date(fechaISO);
  return d.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Bogota",
  });
}

// Revisa que el archivo sea valido antes de subirlo.
// Solo deja pasar imagenes (y PDF si se pide), y que no pese mas de 5 MB.
/** Valida archivos antes de subir a Supabase Storage (solo imágenes / PDF). */
export function validarArchivo(
  file: File,
  opciones?: { permitirPdf?: boolean; maxBytes?: number },
): { ok: boolean; error?: string } {
  const maxBytes = opciones?.permitirPdf
    ? 5 * 1024 * 1024
    : 5 * 1024 * 1024;
  const tiposImagen = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  const tiposPermitidos = opciones?.permitirPdf
    ? [...tiposImagen, "application/pdf"]
    : tiposImagen;
  if (!tiposPermitidos.includes(file.type)) {
    return {
      ok: false,
      error: opciones?.permitirPdf
        ? "Solo se permiten imágenes (jpg, png, webp, avif) o PDF."
        : "Solo se permiten imágenes (jpg, png, webp, avif).",
    };
  }
  if (file.size > maxBytes) {
    return { ok: false, error: "El archivo supera el máximo de 5 MB." };
  }
  return { ok: true };
}

// Saca el codigo del video de una direccion de YouTube para poder mostrarlo dentro de la pagina.
// Acepta links normales, cortos (youtu.be) y shorts. Si no es YouTube devuelve null.
export function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return m ? m[1] : null;
}
