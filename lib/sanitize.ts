import sanitizeHtml from "sanitize-html";

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

/** Sanitiza HTML en el servidor (guardar y renderizar). Previene XSS. */
export function limpiarHtml(dirty: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return sanitizeHtml(dirty ?? "", OPCIONES as any);
}
