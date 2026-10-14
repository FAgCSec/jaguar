"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/app/admin/layout";
import { limpiarHtml } from "@/lib/sanitize";
import { slugify } from "@/lib/utils";

function slugFinal(titulo: string, slug: string) {
  const base = slugify(slug || titulo);
  return base || `articulo-${Date.now()}`;
}

export async function guardarPost(
  tipo: "noticia" | "columna",
  id: string | null,
  formData: FormData,
): Promise<{ error?: string } | never> {
  const { supabase } = await requireAdmin();
  const titulo = String(formData.get("titulo") ?? "").trim().slice(0, 160);
  const slug = slugFinal(titulo, String(formData.get("slug") ?? "").trim());
  const categoria = String(formData.get("categoria") ?? "").trim().slice(0, 60) || null;
  const extracto = String(formData.get("extracto") ?? "").trim().slice(0, 300) || null;
  const imagen_url = String(formData.get("imagen_url") ?? "").trim() || null;
  const contenido = limpiarHtml(String(formData.get("contenido") ?? ""));
  const estado = formData.get("estado") === "publicado" ? "publicado" : "borrador";

  if (!titulo) return { error: "El título es obligatorio." };
  if (contenido.replace(/<[^>]*>/g, "").trim().length < 10) {
    return { error: "El cuerpo está muy corto (mínimo 10 caracteres de texto)." };
  }

  const fila = {
    tipo,
    titulo,
    slug,
    categoria,
    extracto,
    imagen_url,
    contenido,
    estado,
    published_at: estado === "publicado" ? new Date().toISOString() : null,
  };

  // Si se edita y se despublica, conservamos published_at original.
  if (id) {
    const { data: actual } = await supabase.from("posts").select("published_at").eq("id", id).single();
    const prev = (actual as { published_at: string | null } | null)?.published_at ?? null;
    const { error } = await supabase
      .from("posts")
      .update({ ...fila, published_at: estado === "publicado" ? (prev ?? fila.published_at) : null })
      .eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("posts").insert(fila);
    if (error) {
      if (error.message.includes("duplicate") || error.message.includes("slug")) {
        return { error: "Ese slug ya existe. Cambia el título o el slug." };
      }
      return { error: error.message };
    }
  }

  const base = tipo === "columna" ? "/columnas" : "/noticias";
  revalidatePath("/");
  revalidatePath(base);
  revalidatePath(`/admin/${base.slice(1)}`);
  redirect(`/admin/${tipo === "columna" ? "columnas" : "noticias"}`);
}

export async function eliminarPost(id: string, tipo: "noticia" | "columna") {
  const { supabase } = await requireAdmin();
  await supabase.from("posts").delete().eq("id", id);
  const base = tipo === "columna" ? "/columnas" : "/noticias";
  revalidatePath("/");
  revalidatePath(base);
  redirect(`/admin/${tipo === "columna" ? "columnas" : "noticias"}`);
}
