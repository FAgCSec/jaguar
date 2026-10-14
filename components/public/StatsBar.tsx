import { Camera, FileText, Leaf, Map, Sprout, Users, type LucideIcon } from "lucide-react";
import type { Stat } from "@/types";

// Dibuja cada icono segun el nombre guardado en la base (map, doc, users...). Si no coincide, sale una plantica.
const ICONOS: Record<string, LucideIcon> = {
  map: Map,
  doc: FileText,
  users: Users,
  leaf: Leaf,
  camera: Camera,
};

// Barra de numeros del inicio. Si no hay datos, no muestra nada para no dejar hueco vacio.
export function StatsBar({ stats }: { stats: Stat[] }) {
  if (!stats.length) return null;
  return (
    <section aria-label="Cifras de campaña" className="bg-[#F5F5ED]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 py-8 lg:grid-cols-4">
        {stats
          .sort((a, b) => a.orden - b.orden)
          .map((s) => {
            const Icono = ICONOS[s.icono ?? ""] ?? Sprout;
            return (
              <div
                key={s.id}
                className="rounded-2xl bg-white p-5 text-center shadow-md ring-1 ring-[#2E7D32]/10"
              >
                <Icono aria-hidden="true" size={26} className="mx-auto text-[#2E7D32]" />
                <p className="mt-1 text-3xl font-extrabold text-[#1B5E20]">
                  {s.valor}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#1A1A1A]/70">
                  {s.etiqueta}
                </p>
              </div>
            );
          })}
      </div>
    </section>
  );
}
