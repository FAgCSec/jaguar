import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(...inputs);
}

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

/** Extrae el ID de YouTube de una URL para embeber el video. */
export function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return m ? m[1] : null;
}
