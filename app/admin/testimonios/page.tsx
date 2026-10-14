import { requireAdmin } from "../layout";
import { eliminarTestimonio } from "../gestion-actions";
import { TestimonioForm } from "./TestimonioForm";
import type { Testimonial } from "@/types";

export default async function AdminTestimonios() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("testimonials").select("*").order("orden").limit(100);
  const items = (data as Testimonial[]) ?? [];

  return (
    <main className="grid gap-5">
      <h1 className="text-2xl font-extrabold text-[#1B5E20]">Testimonios</h1>
      <div><TestimonioForm /></div>
      <ul className="grid gap-3">
        {items.map((t) => (
          <li key={t.id} className="rounded-2xl bg-white p-4 shadow">
            <p className="italic">“{t.texto}”</p>
            <p className="mt-1 text-sm font-bold">{t.nombre}{t.municipio ? ` · ${t.municipio}` : ""}</p>
            <div className="mt-2 flex gap-2">
              <TestimonioForm inicial={t} />
              <form action={eliminarTestimonio.bind(null, t.id)}>
                <button type="submit" className="rounded-full bg-red-50 px-4 py-1.5 text-sm font-bold text-red-700" onClick={(e) => { if (!confirm("¿Eliminar este testimonio?")) e.preventDefault(); }}>
                  Eliminar
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
