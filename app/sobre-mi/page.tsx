import Image from "next/image";
import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { getConfig } from "@/lib/data";
import { limpiarHtml } from "@/lib/sanitize";

export const metadata: Metadata = { title: "Sobre mí" };
export const revalidate = 60;

export default async function SobreMiPage() {
  const config = await getConfig();
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-[#1B5E20]">Sobre mí</h1>
      <div className="mt-6 grid gap-8 rounded-3xl bg-white p-6 shadow-xl sm:p-10 lg:grid-cols-[320px_1fr]">
        {config?.sobre_mi_foto_url ? (
          <Image
            src={config.sobre_mi_foto_url}
            alt={`Foto de ${SITE.candidato}`}
            width={640}
            height={800}
            sizes="(max-width: 1024px) 100vw, 320px"
            className="w-full rounded-2xl object-cover shadow"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex aspect-[4/5] items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-7xl font-extrabold text-[#C6D92E]"
          >
            {SITE.candidatoCorto.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#2E7D32]">
            {SITE.cargo}
          </p>
          <p className="mt-1 text-2xl font-extrabold text-[#1B5E20]">
            {SITE.candidato}
          </p>
          <div
            className="prose-campana mt-4"
            dangerouslySetInnerHTML={{
              __html: limpiarHtml(
                config?.sobre_mi ??
                  "<p>Muy pronto publicaremos aquí la biografía del candidato.</p>",
              ),
            }}
          />
        </div>
      </div>
    </main>
  );
}
