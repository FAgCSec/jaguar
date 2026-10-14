import type { Stat } from "@/types";

const ICONOS: Record<string, string> = {
  map: "🗺️",
  doc: "📄",
  users: "🤝",
  leaf: "🌿",
};

export function StatsBar({ stats }: { stats: Stat[] }) {
  if (!stats.length) return null;
  return (
    <section aria-label="Cifras de campaña" className="bg-[#F5F5ED]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 py-8 lg:grid-cols-4">
        {stats
          .sort((a, b) => a.orden - b.orden)
          .map((s) => (
            <div
              key={s.id}
              className="rounded-2xl bg-white p-5 text-center shadow-md ring-1 ring-[#2E7D32]/10"
            >
              <p aria-hidden="true" className="text-2xl">
                {ICONOS[s.icono ?? ""] ?? "🌱"}
              </p>
              <p className="mt-1 text-3xl font-extrabold text-[#1B5E20]">
                {s.valor}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#1A1A1A]/70">
                {s.etiqueta}
              </p>
            </div>
          ))}
      </div>
    </section>
  );
}
