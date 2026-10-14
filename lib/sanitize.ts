import sanitizeHtml from "sanitize-html";

// Aqui se dice que etiquetas se permiten en los textos del editor (parrafos, negritas, listas, etc).
// Todo lo demas se borra para evitar codigo peligroso.
// Los videos solo se permiten si son de YouTube.
/** Opciones compartidas servidor + cliente para el HTML del editor. */
const OPCIONES = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "h2",
    "h3",
    "ul",
    "ol",
    "li",
    "blockquote",
    "a",
    "img",
    "iframe",
    "figure",
    "figcaption",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "width", "height", "loading"],
    iframe: ["src", "width", "height", "allow", "allowfullscreen", "frameborder", "title"],
    figure: ["class"],
    p: ["class"],
    blockquote: ["class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  // Solo iframes de YouTube
  allowedIframeHostnames: ["www.youtube.com", "youtube.com", "youtu.be", "www.youtube-nocookie.com"],
} as const;

// Limpia el HTML antes de guardarlo o mostrarlo. Quita scripts y cosas raras que puedan hacer daño.
export function limpiarHtml(dirty: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return sanitizeHtml(dirty ?? "", OPCIONES as any);
}
