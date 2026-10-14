"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/app/admin/layout";

// ---------- GALERÍA ----------
export async function agregarFoto(formData: FormData) {
  const { supabase } = await requireAdmin();
  const url = String(formData.get("url") ?? "").trim();
  const titulo = String(formData.get("titulo") ?? "").trim().slice(0, 120) || null;
  if (!url) return { error: "Sube primero la imagen." };
  const { data: max } = await supabase.from("gallery_images").select("orden").order("orden", { ascending: false }).limit(1).single();
  const orden = ((max as { orden: number } | null)?.orden ?? 0) + 1;
  const { error } = await supabase.from("gallery_images").insert({ url, titulo, orden });
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/galeria");
}

export async function eliminarFoto(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("gallery_images").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/galeria");
}

export async function reordenarFoto(id: string, direccion: "up" | "down") {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("gallery_images").select("*").order("orden");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lista = (data as any[]) ?? [];
  const i = lista.findIndex((g) => g.id === id);
  const j = direccion === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= lista.length) return;
  const a = lista[i];
  const b = lista[j];
  await supabase.from("gallery_images").update({ orden: b.orden }).eq("id", a.id);
  await supabase.from("gallery_images").update({ orden: a.orden }).eq("id", b.id);
  revalidatePath("/");
  revalidatePath("/galeria");
}

// ---------- TESTIMONIOS ----------
export async function guardarTestimonio(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "") || null;
  const nombre = String(formData.get("nombre") ?? "").trim().slice(0, 120);
  const municipio = String(formData.get("municipio") ?? "").trim().slice(0, 80) || null;
  const foto_url = String(formData.get("foto_url") ?? "").trim() || null;
  const texto = String(formData.get("texto") ?? "").trim().slice(0, 600);
  const orden = Number(formData.get("orden") ?? 0) || 0;
  if (!nombre || !texto) return { error: "Nombre y texto son obligatorios." };
  if (id) {
    const { error } = await supabase.from("testimonials").update({ nombre, municipio, foto_url, texto, orden }).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("testimonials").insert({ nombre, municipio, foto_url, texto, orden });
    if (error) return { error: error.message };
  }
  revalidatePath("/");
}

export async function eliminarTestimonio(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("testimonials").delete().eq("id", id);
  revalidatePath("/");
}

// ---------- ESTADÍSTICAS ----------
export async function guardarStat(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "") || null;
  const etiqueta = String(formData.get("etiqueta") ?? "").trim().slice(0, 60);
  const valor = String(formData.get("valor") ?? "").trim().slice(0, 20);
  const icono = String(formData.get("icono") ?? "").trim().slice(0, 20) || null;
  const orden = Number(formData.get("orden") ?? 0) || 0;
  if (!etiqueta || !valor) return { error: "Etiqueta y valor son obligatorios." };
  if (id) {
    const { error } = await supabase.from("stats").update({ etiqueta, valor, icono, orden }).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("stats").insert({ etiqueta, valor, icono, orden });
    if (error) return { error: error.message };
  }
  revalidatePath("/");
}

export async function eliminarStat(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("stats").delete().eq("id", id);
  revalidatePath("/");
}

// ---------- PROPUESTAS ----------
export async function guardarGrupo(formData: FormData) {
  const { supabase } = await requireAdmin();
  const tema = String(formData.get("tema") ?? "").trim().slice(0, 120);
  if (!tema) return { error: "El tema es obligatorio." };
  const { data: max } = await supabase.from("proposal_groups").select("orden").order("orden", { ascending: false }).limit(1).single();
  const orden = ((max as { orden: number } | null)?.orden ?? 0) + 1;
  const { error } = await supabase.from("proposal_groups").insert({ tema, orden });
  if (error) return { error: error.message };
  revalidatePath("/propuestas");
  revalidatePath("/");
}

export async function eliminarGrupo(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("proposal_groups").delete().eq("id", id);
  revalidatePath("/propuestas");
  revalidatePath("/");
}

export async function guardarPropuesta(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "") || null;
  const group_id = String(formData.get("group_id") ?? "");
  const titulo = String(formData.get("titulo") ?? "").trim().slice(0, 160);
  const descripcion = String(formData.get("descripcion") ?? "").trim().slice(0, 600) || null;
  if (!group_id || !titulo) return { error: "Grupo y título son obligatorios." };
  if (id) {
    const { error } = await supabase.from("proposals").update({ titulo, descripcion }).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { data: max } = await supabase.from("proposals").select("orden").eq("group_id", group_id).order("orden", { ascending: false }).limit(1).single();
    const orden = ((max as { orden: number } | null)?.orden ?? 0) + 1;
    const { error } = await supabase.from("proposals").insert({ group_id, titulo, descripcion, orden });
    if (error) return { error: error.message };
  }
  revalidatePath("/propuestas");
  revalidatePath("/");
}

export async function eliminarPropuesta(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("proposals").delete().eq("id", id);
  revalidatePath("/propuestas");
  revalidatePath("/");
}

// ---------- SOBRE MÍ / CONFIG ----------
export async function guardarPdfPlan(formData: FormData) {
  const { supabase } = await requireAdmin();
  const pdf_plan_url = String(formData.get("pdf_plan_url") ?? "").trim() || null;
  const { error } = await supabase
    .from("site_config")
    .update({ pdf_plan_url, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) return { error: error.message };
  revalidatePath("/propuestas");
}

export async function guardarConfig(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { limpiarHtml } = await import("@/lib/sanitize");
  const eslogan = String(formData.get("eslogan") ?? "").trim().slice(0, 160);
  const sobre_mi = limpiarHtml(String(formData.get("sobre_mi") ?? ""));
  const sobre_mi_foto_url = String(formData.get("sobre_mi_foto_url") ?? "").trim() || null;
  const hero_imagen_url = String(formData.get("hero_imagen_url") ?? "").trim() || null;
  const pdf_plan_url = String(formData.get("pdf_plan_url") ?? "").trim() || null;
  const { error } = await supabase
    .from("site_config")
    .update({ eslogan, sobre_mi, sobre_mi_foto_url, hero_imagen_url, pdf_plan_url, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/sobre-mi");
  revalidatePath("/propuestas");
}

// ---------- MENSAJES ----------
export async function marcarLeido(id: string, leido: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from("contact_messages").update({ leido }).eq("id", id);
  revalidatePath("/admin/mensajes");
}

export async function eliminarMensaje(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("contact_messages").delete().eq("id", id);
  revalidatePath("/admin/mensajes");
}
