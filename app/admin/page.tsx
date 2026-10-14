import Link from "next/link";
import type { Metadata } from "next";
import {
  BadgeCheck,
  FileEdit,
  Images,
  Inbox,
  MessagesSquare,
  Plus,
} from "lucide-react";
import { requireAdmin } from "./layout";

// Portada del panel con resumen: cuantos publicados, borradores, mensajes, fotos y testimonios.
// Cada tarjeta lleva a su seccion para trabajar.
export const metadata: Metadata = { title: "Panel" };

export default async function AdminDashboard() {
  const { supabase } = await requireAdmin();
  // Se piden los conteos al tiempo para que cargue rapido
  const [posts, mensajes, galeria, testimonios] = await Promise.all([
    supabase.from("posts").select("id, estado", { count: "exact" }),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("leido", false),
    supabase.from("gallery_images").select("id", { count: "exact", head: true }),
    supabase.from("testimonials").select("id", { count: "exact", head: true }),
  ]);
  const publicados = (posts.data ?? []).filter((p) => (p as { estado: string }).estado === "publicado").length;
  const borradores = (posts.data ?? []).length - publicados;

  const tarjetas = [
    { titulo: "Publicados", valor: publicados, href: "/admin/noticias", Icono: BadgeCheck },
    { titulo: "Borradores", valor: borradores, href: "/admin/noticias", Icono: FileEdit },
    { titulo: "Mensajes sin leer", valor: mensajes.count ?? 0, href: "/admin/mensajes", Icono: Inbox },
    { titulo: "Fotos en galería", valor: galeria.count ?? 0, href: "/admin/galeria", Icono: Images },
    { titulo: "Testimonios", valor: testimonios.count ?? 0, href: "/admin/testimonios", Icono: MessagesSquare },
  ];

  return (
    <main>
      <h1 className="flex items-center gap-2 text-2xl font-extrabold text-[#1B5E20]">¡Hola, equipo!</h1>
      <p className="mt-1 text-sm text-[#1A1A1A]/70">
        Publica noticias, columnas y fotos. Todo lo guardado como borrador no se ve en el sitio público.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tarjetas.map((t) => (
          <Link
            key={t.titulo}
            href={t.href}
            className="rounded-2xl bg-white p-5 shadow transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <t.Icono size={24} className="text-[#2E7D32]" />
            <p className="mt-2 text-3xl font-extrabold text-[#1B5E20]">{t.valor}</p>
            <p className="text-sm font-semibold">{t.titulo}</p>
          </Link>
        ))}
        <Link
          href="/admin/noticias/nuevo"
          className="rounded-2xl bg-[#C6D92E] p-5 font-bold text-[#1B5E20] shadow hover:bg-[#D4E157]"
        >
          <Plus size={24} />
          <p className="mt-2">Crear noticia o columna</p>
          <p className="text-sm font-normal">Empieza a publicar en 1 minuto</p>
        </Link>
      </div>
    </main>
  );
}
