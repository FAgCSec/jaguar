import { requireAdmin } from "../layout";
import { eliminarStat, guardarStat } from "../gestion-actions";
import type { Stat } from "@/types";

export default async function AdminStats() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("stats").select("*").order("orden").limit(50);
  const stats = (data as Stat[]) ?? [];

  return (
    <main className="grid gap-5">
      <h1 className="text-2xl font-extrabold text-[#1B5E20]">Estadísticas del hero</h1>
      <p className="text-sm text-[#1A1A1A]/70">
        Estos números aparecen en la barra de contadores de la página principal. Iconos: map, doc, users, leaf.
      </p>
      <form action={async (fd: FormData) => { await guardarStat(fd); }} className="grid gap-3 rounded-2xl bg-white p-5 shadow sm:grid-cols-4">
        <label className="grid gap-1 text-sm font-semibold">
          Etiqueta *
          <input name="etiqueta" required maxLength={60} placeholder="Municipios visitados" className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal outline-none ring-1 ring-[#2E7D32]/15" />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Valor *
          <input name="valor" required maxLength={20} placeholder="32" className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal outline-none ring-1 ring-[#2E7D32]/15" />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Icono
          <select name="icono" className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal outline-none ring-1 ring-[#2E7D32]/15">
            <option value="">Automático</option>
            <option value="map">Mapa</option>
            <option value="doc">Documento</option>
            <option value="users">Personas</option>
            <option value="leaf">Hoja</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Orden
          <input name="orden" type="number" defaultValue={stats.length + 1} className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal outline-none ring-1 ring-[#2E7D32]/15" />
        </label>
        <div className="sm:col-span-4">
          <button type="submit" className="rounded-full bg-[#1B5E20] px-5 py-2 font-bold text-white hover:bg-[#2E7D32]">
            Agregar estadística
          </button>
        </div>
      </form>
      <ul className="grid gap-3 sm:grid-cols-2">
        {stats.map((s) => (
          <li key={s.id} className="rounded-2xl bg-white p-4 shadow">
            <form action={async (fd: FormData) => { await guardarStat(fd); }} className="grid gap-2">
              <input type="hidden" name="id" value={s.id} />
              <div className="grid grid-cols-2 gap-2">
                <input name="etiqueta" defaultValue={s.etiqueta} aria-label="Etiqueta" className="rounded-xl bg-[#F5F5ED] px-3 py-2 text-sm outline-none ring-1 ring-[#2E7D32]/15" />
                <input name="valor" defaultValue={s.valor} aria-label="Valor" className="rounded-xl bg-[#F5F5ED] px-3 py-2 text-sm font-bold outline-none ring-1 ring-[#2E7D32]/15" />
                <input name="icono" defaultValue={s.icono ?? ""} aria-label="Icono" className="rounded-xl bg-[#F5F5ED] px-3 py-2 text-sm outline-none ring-1 ring-[#2E7D32]/15" />
                <input name="orden" type="number" defaultValue={s.orden} aria-label="Orden" className="rounded-xl bg-[#F5F5ED] px-3 py-2 text-sm outline-none ring-1 ring-[#2E7D32]/15" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="rounded-full bg-[#F5F5ED] px-4 py-1.5 text-sm font-bold text-[#1B5E20] ring-1 ring-[#2E7D32]/20">Guardar</button>
                <button type="submit" formAction={eliminarStat.bind(null, s.id)} className="rounded-full bg-red-50 px-4 py-1.5 text-sm font-bold text-red-700">Eliminar</button>
              </div>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
