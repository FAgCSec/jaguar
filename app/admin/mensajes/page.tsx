import { requireAdmin } from "../layout";
import { eliminarMensaje, marcarLeido } from "../gestion-actions";
import { Inbox, Mail, MapPin, MessageCircle, Phone, Trash2 } from "lucide-react";
import type { ContactMessage } from "@/types";

export default async function AdminMensajes({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  let q = supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(200);
  if (sp.filtro === "noleidos") q = q.eq("leido", false);
  const { data } = await q;
  const mensajes = (data as ContactMessage[]) ?? [];

  return (
    <main>
      <h1 className="text-2xl font-extrabold text-[#1B5E20]">Mensajes y voluntarios</h1>
      <div className="mt-3 flex gap-2 text-sm font-semibold">
        <a href="/admin/mensajes" className="rounded-full bg-white px-4 py-1.5 shadow">Todos</a>
        <a href="/admin/mensajes?filtro=noleidos" className="rounded-full bg-white px-4 py-1.5 shadow">Sin leer</a>
      </div>
      <ul className="mt-4 grid gap-3">
        {mensajes.map((m) => (
          <li key={m.id} className={`rounded-2xl p-4 shadow ${m.leido ? "bg-white" : "bg-[#f0f4c3] ring-2 ring-[#C6D92E]"}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold">
                {m.nombre}
                {!m.leido && <span className="ml-2 rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs text-white">nuevo</span>}
              </p>
              <time className="text-xs text-[#1A1A1A]/60">
                {new Date(m.created_at).toLocaleString("es-CO", { timeZone: "America/Bogota" })}
              </time>
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span className="inline-flex items-center gap-1"><Phone size={14} className="text-[#2E7D32]" /> {m.whatsapp ?? "—"}</span>
              {m.email ? (<span className="inline-flex items-center gap-1"><Mail size={14} className="text-[#2E7D32]" /> {m.email}</span>) : ""}
              {m.municipio ? (<span className="inline-flex items-center gap-1"><MapPin size={14} className="text-[#2E7D32]" /> {m.municipio}</span>) : ""}
            </p>
            <p className="mt-2 rounded-xl bg-white/70 p-3 text-sm">{m.mensaje}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {m.whatsapp && (
                <a
                  href={`https://wa.me/57${m.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#2E7D32] px-4 py-1.5 text-sm font-bold text-white"
                >
                  <MessageCircle size={15} /> Responder por WhatsApp
                </a>
              )}
              <form action={marcarLeido.bind(null, m.id, !m.leido)}>
                <button type="submit" className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-[#1B5E20] ring-1 ring-[#2E7D32]/20">
                  {m.leido ? "Marcar sin leer" : "Marcar leído"}
                </button>
              </form>
              <form action={eliminarMensaje.bind(null, m.id)}>
                <button type="submit" className="inline-flex items-center gap-1 rounded-full bg-red-50 px-4 py-1.5 text-sm font-bold text-red-700" onClick={(e) => { if (!confirm("¿Eliminar este mensaje?")) e.preventDefault(); }}>
                  <Trash2 size={14} /> Eliminar
                </button>
              </form>
            </div>
          </li>
        ))}
        {!mensajes.length && <p className="flex items-center justify-center gap-2 rounded-2xl bg-white p-8 text-center shadow"><Inbox size={20} className="text-[#2E7D32]" /> No hay mensajes.</p>}
      </ul>
    </main>
  );
}
