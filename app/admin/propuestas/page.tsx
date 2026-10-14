import { requireAdmin } from "../layout";
import {
  eliminarGrupo,
  eliminarPropuesta,
  guardarGrupo,
  guardarPropuesta,
} from "../gestion-actions";
import { PdfPlanForm } from "./PdfPlanForm";
import { Plus, Sprout, Trash2 } from "lucide-react";

// Manejo del plan: pdf arriba, luego crear temas y dentro de cada tema sus propuestas.
// Cada propuesta se puede editar en el mismo cuadro y guardar, o borrar.
export default async function AdminPropuestas() {
  const { supabase } = await requireAdmin();
  const [{ data: grupos }, { data: config }] = await Promise.all([
    supabase.from("proposal_groups").select("*").order("orden"),
    supabase.from("site_config").select("pdf_plan_url").eq("id", 1).single(),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lista = (grupos as any[]) ?? [];
  const { data: props } = await supabase.from("proposals").select("*").order("orden");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const todas = (props as any[]) ?? [];
  const pdf = (config as { pdf_plan_url: string | null } | null)?.pdf_plan_url ?? "";

  return (
    <main className="grid gap-5">
      <h1 className="text-2xl font-extrabold text-[#1B5E20]">Propuestas y plan de gobierno</h1>

      <PdfPlanForm inicial={pdf} />

      <form action={async (fd: FormData) => { await guardarGrupo(fd); }} className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-5 shadow">
        <label className="grid flex-1 gap-1 text-sm font-semibold">
          Nuevo tema (grupo) *
          <input name="tema" required maxLength={120} placeholder="Ej. Campo y selva productiva" className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal outline-none ring-1 ring-[#2E7D32]/15" />
        </label>
        <button type="submit" className="inline-flex items-center gap-1.5 rounded-full bg-[#C6D92E] px-5 py-2.5 font-bold text-[#1B5E20]"><Plus size={17} /> Agregar tema</button>
      </form>

      {lista.map((g) => (
        <section key={g.id} className="rounded-2xl bg-white p-5 shadow">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#1B5E20]"><Sprout size={20} className="text-[#2E7D32]" /> {g.tema}</h2>
            <form action={eliminarGrupo.bind(null, g.id)}>
              <button type="submit" className="inline-flex items-center gap-1 rounded-full bg-red-50 px-4 py-1.5 text-sm font-bold text-red-700" onClick={(e) => { if (!confirm("¿Eliminar el tema y sus propuestas?")) e.preventDefault(); }}>
                <Trash2 size={14} /> Eliminar tema
              </button>
            </form>
          </div>
          <ul className="mt-3 grid gap-2">
            {todas.filter((p) => p.group_id === g.id).map((p) => (
              <li key={p.id} className="rounded-xl bg-[#F5F5ED] p-3">
                <form action={async (fd: FormData) => { await guardarPropuesta(fd); }} className="grid gap-2">
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="group_id" value={g.id} />
                  <input name="titulo" defaultValue={p.titulo} aria-label="Título" className="rounded-lg bg-white px-3 py-2 text-sm font-bold outline-none ring-1 ring-[#2E7D32]/15" />
                  <textarea name="descripcion" defaultValue={p.descripcion ?? ""} rows={2} aria-label="Descripción" className="rounded-lg bg-white px-3 py-2 text-sm outline-none ring-1 ring-[#2E7D32]/15" />
                  <div className="flex gap-2">
                    <button type="submit" className="rounded-full bg-white px-4 py-1 text-sm font-bold text-[#1B5E20] ring-1 ring-[#2E7D32]/20">Guardar</button>
                    <button type="submit" formAction={eliminarPropuesta.bind(null, p.id)} className="inline-flex items-center gap-1 rounded-full bg-red-50 px-4 py-1 text-sm font-bold text-red-700"><Trash2 size={14} /> Eliminar</button>
                  </div>
                </form>
              </li>
            ))}
          </ul>
          <form action={async (fd: FormData) => { await guardarPropuesta(fd); }} className="mt-3 grid gap-2 rounded-xl bg-[#f1f8e9] p-3">
            <input type="hidden" name="group_id" value={g.id} />
            <input name="titulo" required maxLength={160} placeholder="Nueva propuesta: título *" className="rounded-lg bg-white px-3 py-2 text-sm outline-none ring-1 ring-[#2E7D32]/15" />
            <textarea name="descripcion" rows={2} maxLength={600} placeholder="Descripción (opcional)" className="rounded-lg bg-white px-3 py-2 text-sm outline-none ring-1 ring-[#2E7D32]/15" />
            <button type="submit" className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#1B5E20] px-4 py-1.5 text-sm font-bold text-white"><Plus size={15} /> Agregar propuesta</button>
          </form>
        </section>
      ))}
    </main>
  );
}
