"use client";

import { useRef, useState } from "react";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  MonitorPlay,
  Pilcrow,
  Quote,
} from "lucide-react";
import { youtubeId } from "@/lib/utils";

/**
 * Editor de texto enriquecido liviano (sin dependencias pesadas):
 * negritas, cursiva, títulos, listas, citas, enlaces, imágenes y YouTube.
 * El HTML se sanitiza en el servidor antes de guardar (ver lib/sanitize.ts).
 */
export function RichTextEditor({
  name,
  initialValue = "",
}: {
  name: string;
  initialValue?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState(initialValue);

  function cmd(comando: string, valor?: string) {
    ref.current?.focus();
    document.execCommand(comando, false, valor);
    setHtml(ref.current?.innerHTML ?? "");
  }

  function insertarEnlace() {
    const url = prompt("URL del enlace (https://…):");
    if (url) cmd("createLink", url);
  }

  function insertarImagen() {
    const url = prompt("URL de la imagen (súbela primero en Galería o Noticias):");
    if (!url) return;
    const alt = prompt("Texto descriptivo de la imagen (accesibilidad):") ?? "";
    ref.current?.focus();
    document.execCommand(
      "insertHTML",
      false,
      `<img src="${url.replace(/"/g, "")}" alt="${alt.replace(/"/g, "")}" loading="lazy" />`,
    );
    setHtml(ref.current?.innerHTML ?? "");
  }

  function insertarYoutube() {
    const url = prompt("URL del video de YouTube:");
    if (!url) return;
    const id = youtubeId(url);
    if (!id) {
      alert("No reconocimos esa URL de YouTube.");
      return;
    }
    ref.current?.focus();
    document.execCommand(
      "insertHTML",
      false,
      `<iframe src="https://www.youtube.com/embed/${id}" title="Video de YouTube" allowfullscreen loading="lazy"></iframe>`,
    );
    setHtml(ref.current?.innerHTML ?? "");
  }

  const btn =
    "flex items-center rounded-lg bg-[#F5F5ED] px-2.5 py-1.5 text-sm font-bold hover:bg-[#C6D92E]";
  const iconProps = { size: 16 } as const;

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1.5" role="toolbar" aria-label="Formato de texto">
        <button type="button" className={btn} onClick={() => cmd("bold")} title="Negrita" aria-label="Negrita"><Bold {...iconProps} /></button>
        <button type="button" className={btn} onClick={() => cmd("italic")} title="Cursiva" aria-label="Cursiva"><Italic {...iconProps} /></button>
        <button type="button" className={btn} onClick={() => cmd("formatBlock", "h2")} title="Título" aria-label="Título"><Heading2 {...iconProps} /></button>
        <button type="button" className={btn} onClick={() => cmd("formatBlock", "h3")} title="Subtítulo" aria-label="Subtítulo"><Heading3 {...iconProps} /></button>
        <button type="button" className={btn} onClick={() => cmd("formatBlock", "p")} title="Párrafo" aria-label="Párrafo"><Pilcrow {...iconProps} /></button>
        <button type="button" className={btn} onClick={() => cmd("insertUnorderedList")} title="Lista" aria-label="Lista"><List {...iconProps} /></button>
        <button type="button" className={btn} onClick={() => cmd("insertOrderedList")} title="Lista numerada" aria-label="Lista numerada"><ListOrdered {...iconProps} /></button>
        <button type="button" className={btn} onClick={() => cmd("formatBlock", "blockquote")} title="Cita" aria-label="Cita"><Quote {...iconProps} /></button>
        <button type="button" className={btn} onClick={insertarEnlace} title="Enlace" aria-label="Enlace"><Link2 {...iconProps} /></button>
        <button type="button" className={btn} onClick={insertarImagen} title="Imagen" aria-label="Imagen"><ImagePlus {...iconProps} /></button>
        <button type="button" className={btn} onClick={insertarYoutube} title="Video de YouTube" aria-label="Video de YouTube"><MonitorPlay {...iconProps} /></button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Cuerpo del artículo"
        onInput={() => setHtml(ref.current?.innerHTML ?? "")}
        dangerouslySetInnerHTML={{ __html: initialValue }}
        className="prose-campana min-h-64 rounded-xl bg-white p-4 text-[15px] ring-1 ring-[#2E7D32]/20 outline-none focus:ring-2 focus:ring-[#2E7D32]"
      />
      <input type="hidden" name={name} value={html} />
      <p className="mt-1 text-xs text-[#1A1A1A]/60">
        Tip: pega el texto, selecciónalo y aplica formato con la barra. El contenido se limpia
        automáticamente contra XSS al guardar.
      </p>
    </div>
  );
}
