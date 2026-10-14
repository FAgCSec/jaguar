import {
  ChevronDown,
  CircleCheck,
  FileDown,
  HeartPulse,
  Route,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import type { ProposalGroup } from "@/types";

// Cada tema lleva su icono y color de borde para diferenciarlos.
// Se van rotando segun la posicion.
const ICONOS: LucideIcon[] = [Sprout, HeartPulse, Route];
const FRANJAS = ["border-l-[#1B5E20]", "border-l-[#C6D92E]", "border-l-[#2E7D32]"];

// Lista de temas del plan que se abren y cierran al hacer clic.
// Abiertos = si vienen abiertos desde el inicio (en /propuestas si, en el inicio no).
export function ProposalSection({
  grupos,
  pdfUrl,
  abiertos = false,
}: {
  grupos: ProposalGroup[];
  pdfUrl: string | null;
  abiertos?: boolean;
}) {
  return (
    <div className="grid gap-4">
      {grupos.map((g, i) => {
        const Icono = ICONOS[i % ICONOS.length];
        const franja = FRANJAS[i % FRANJAS.length];
        const n = (g.proposals ?? []).length;
        return (
          <details
            key={g.id}
            open={abiertos}
            className={`group overflow-hidden rounded-2xl border-l-8 bg-white shadow-md ring-1 ring-[#2E7D32]/10 ${franja}`}
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 p-5 [&::-webkit-details-marker]:hidden">
              <span className="text-2xl font-extrabold text-[#1B5E20]/25">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C6D92E] text-[#1B5E20]">
                <Icono size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-extrabold text-[#1B5E20]">{g.tema}</span>
                <span className="block text-xs font-semibold text-[#1A1A1A]/55">
                  {n} {n === 1 ? "propuesta" : "propuestas"}
                </span>
              </span>
              <ChevronDown
                size={20}
                className="shrink-0 text-[#2E7D32] transition-transform group-open:rotate-180"
              />
            </summary>
            <ul className="grid gap-3 border-t border-[#2E7D32]/10 bg-[#F5F5ED]/60 p-5 pt-4 sm:grid-cols-2">
              {(g.proposals ?? []).map((p) => (
                <li key={p.id} className="flex gap-2">
                  <CircleCheck size={18} className="mt-0.5 shrink-0 text-[#2E7D32]" />
                  <div>
                    <p className="font-bold text-[#1A1A1A]">{p.titulo}</p>
                    {p.descripcion && (
                      <p className="mt-0.5 text-sm text-[#1A1A1A]/75">{p.descripcion}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </details>
        );
      })}
      {pdfUrl && (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-[#C6D92E] px-6 py-3 font-bold text-[#1B5E20] shadow-lg transition hover:bg-[#D4E157]"
        >
          <FileDown size={18} />
          Descargar plan de gobierno completo (PDF)
        </a>
      )}
    </div>
  );
}
