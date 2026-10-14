import type { Metadata } from "next";
import { ProposalSection } from "@/components/public/ProposalSection";
import { getPropuestas } from "@/lib/data";

export const metadata: Metadata = { title: "Propuestas" };
export const revalidate = 60;

export default async function PropuestasPage() {
  const { grupos, pdfUrl } = await getPropuestas();
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-[#1B5E20]">
        Plan de gobierno
      </h1>
      <p className="mt-1 text-sm text-[#1A1A1A]/70">
        Propuestas agrupadas por tema. Hechas con la gente, para la gente.
      </p>
      <div className="mt-6">
        {grupos.length ? (
          <ProposalSection grupos={grupos} pdfUrl={pdfUrl} />
        ) : (
          <p className="rounded-2xl bg-white p-8 text-center shadow">
            Estamos publicando el plan de gobierno. Vuelve pronto. 📄
          </p>
        )}
      </div>
    </main>
  );
}
