import type { ProposalGroup } from "@/types";

export function ProposalSection({
  grupos,
  pdfUrl,
}: {
  grupos: ProposalGroup[];
  pdfUrl: string | null;
}) {
  return (
    <div className="grid gap-4">
      {grupos.map((g) => (
        <details
          key={g.id}
          open
          className="group rounded-2xl bg-white p-5 shadow-md ring-1 ring-[#2E7D32]/10"
        >
          <summary className="cursor-pointer list-none text-lg font-bold text-[#1B5E20] [&::-webkit-details-marker]:hidden">
            <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#C6D92E] text-[#1B5E20]">
              🌱
            </span>
            {g.tema}
          </summary>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {(g.proposals ?? []).map((p) => (
              <li key={p.id} className="rounded-xl bg-[#F5F5ED] p-4 ring-1 ring-[#2E7D32]/10">
                <p className="font-bold">{p.titulo}</p>
                {p.descripcion && (
                  <p className="mt-1 text-sm text-[#1A1A1A]/75">{p.descripcion}</p>
                )}
              </li>
            ))}
          </ul>
        </details>
      ))}
      {pdfUrl && (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-[#1B5E20] px-6 py-3 font-bold text-white shadow hover:bg-[#2E7D32]"
        >
          📄 Descargar plan de gobierno completo (PDF)
        </a>
      )}
    </div>
  );
}
