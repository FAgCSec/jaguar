import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Sprout } from "lucide-react";
import { Hero } from "@/components/public/Hero";
import { StatsBar } from "@/components/public/StatsBar";
import { NewsCard } from "@/components/public/NewsCard";
import { GalleryGrid } from "@/components/public/GalleryGrid";
import { TestimonialCarousel } from "@/components/public/TestimonialCarousel";
import { ProposalSection } from "@/components/public/ProposalSection";
import { ContactForm } from "@/components/public/ContactForm";
import { DivisorHojas } from "@/components/public/LeafDecor";
import { SITE } from "@/lib/constants";
import {
  getConfig,
  getGaleria,
  getLoMejorDeLaSemana,
  getPosts,
  getPropuestas,
  getStats,
  getTestimonios,
} from "@/lib/data";

// Titulo y descripcion que sale en Google para el inicio
export const metadata: Metadata = {
  title: `${SITE.candidato} — ${SITE.eslogan}`,
  description: SITE.descripcion,
};

// La pagina se actualiza sola cada 60 segundos sin tener que volver a publicar
export const revalidate = 60;

export default async function Home() {
  // Se piden todos los datos al tiempo para que cargue mas rapido
  const [config, stats, noticias, columnas, galeria, semana, testimonios, propuestas] =
    await Promise.all([
      getConfig(),
      getStats(),
      getPosts("noticia", 6),
      getPosts("columna", 3),
      getGaleria(7),
      getLoMejorDeLaSemana(3),
      getTestimonios(),
      getPropuestas(),
    ]);

  return (
    <main>
      <Hero config={config} />
      <StatsBar stats={stats} />

      {/* Noticias recientes en cinta que se mueve sola. Se duplica la lista para que el movimiento no se corte. */}
      <section className="mx-auto max-w-6xl px-4 py-12" aria-labelledby="noticias-h">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 id="noticias-h" className="text-2xl font-extrabold text-[#1B5E20] sm:text-3xl">
              Noticias recientes
            </h2>
            <p className="mt-1 text-sm text-[#1A1A1A]/70">
              Lo que pasa en el territorio, contado por la campaña.
            </p>
          </div>
          <Link
            href="/noticias"
            className="shrink-0 rounded-full bg-[#1B5E20] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2E7D32]"
          >
            Ver todas
          </Link>
        </div>
        <DivisorHojas />
        {noticias.length ? (
          <div className="marquee overflow-hidden">
            <div className="marquee-track flex gap-5">
              {[...noticias, ...noticias].map((n, i) => (
                <div
                  key={`${n.id}-${i}`}
                  aria-hidden={i >= noticias.length}
                  className="w-80 shrink-0 sm:w-96"
                >
                  <NewsCard post={n} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="rounded-2xl bg-white p-8 text-center shadow">
            Aún no hay noticias publicadas.
          </p>
        )}
      </section>

      {/* Columnas de opinion, en cuadricula normal de 3 por fila */}
      <section className="bg-white" aria-labelledby="columnas-h">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-end justify-between gap-3">
            <h2 id="columnas-h" className="text-2xl font-extrabold text-[#1B5E20] sm:text-3xl">
              Columnas de opinión
            </h2>
            <Link href="/columnas" className="inline-flex shrink-0 items-center gap-1 font-bold text-[#2E7D32] hover:underline">
              Ver todas <ArrowRight size={16} />
            </Link>
          </div>
          <DivisorHojas />
          {columnas.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {columnas.map((c) => (
                <NewsCard key={c.id} post={c} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-[#F5F5ED] p-8 text-center">
              Pronto publicaremos las columnas del candidato.
            </p>
          )}
        </div>
      </section>

      {/* Resumen del plan: solo muestra los 3 primeros temas, el resto esta en /propuestas */}
      <section className="mx-auto max-w-6xl px-4 py-12" aria-labelledby="prop-h">
        <h2 id="prop-h" className="text-2xl font-extrabold text-[#1B5E20] sm:text-3xl">
          Propuestas del plan de gobierno
        </h2>
        <DivisorHojas />
        <ProposalSection grupos={propuestas.grupos.slice(0, 3)} pdfUrl={propuestas.pdfUrl} />
        <Link
          href="/propuestas"
          className="mt-4 inline-block rounded-full border-2 border-[#1B5E20] px-6 py-2.5 font-bold text-[#1B5E20] hover:bg-[#1B5E20] hover:text-white"
        >
          Ver plan completo
        </Link>
      </section>

      {/* Fotos de campaña */}
      <section className="bg-white" aria-labelledby="gal-h">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-end justify-between gap-3">
            <h2 id="gal-h" className="text-2xl font-extrabold text-[#1B5E20] sm:text-3xl">
              Galería de campaña
            </h2>
            <Link href="/galeria" className="inline-flex shrink-0 items-center gap-1 font-bold text-[#2E7D32] hover:underline">
              Ver galería <ArrowRight size={16} />
            </Link>
          </div>
          <DivisorHojas />
          <GalleryGrid imagenes={galeria} />
        </div>
      </section>

      {/* Solo sale si hay algo publicado en los ultimos 7 dias. Si no hay, se oculta toda la seccion. */}
      {semana.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12" aria-labelledby="semana-h">
          <div>
            <h2 id="semana-h" className="text-2xl font-extrabold text-[#1B5E20] sm:text-3xl">
              Lo mejor de la semana
            </h2>
            <p className="mt-1 text-sm text-[#1A1A1A]/70">
              Lo más reciente de la campaña.
            </p>
          </div>
          <DivisorHojas />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {semana.map((s) => (
              <NewsCard key={s.id} post={s} />
            ))}
          </div>
        </section>
      )}

      {/* Lo que dice la gente */}
      <section className="mx-auto max-w-6xl px-4 py-12" aria-labelledby="test-h">
        <h2 id="test-h" className="text-center text-2xl font-extrabold text-[#1B5E20] sm:text-3xl">
          Lo que dice la gente
        </h2>
        <DivisorHojas />
        <TestimonialCarousel items={testimonios} />
      </section>

      {/* Formulario para ser voluntario. Los datos llegan al panel admin en Mensajes. */}
      <section className="bg-[#1B5E20] text-white" aria-labelledby="contacto-h">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-2">
          <div>
            <h2 id="contacto-h" className="text-2xl font-extrabold sm:text-3xl">
              Súmate como voluntario
            </h2>
            <p className="mt-2 flex items-start gap-2 text-white/85">
              <Sprout size={20} className="mt-0.5 shrink-0 text-[#D4E157]" />
              Déjanos tus datos y te contactamos por WhatsApp. Cada mano cuenta
              para que {SITE.departamento} florezca.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
