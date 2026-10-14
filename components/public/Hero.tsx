import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import type { SiteConfig } from "@/types";

// Portada grande del inicio. El fondo y el eslogan se pueden cambiar desde el admin en Sobre mi.
// Si no hay foto, muestra un fondo verde con degradado para que no se vea vacio.
export function Hero({ config }: { config: SiteConfig | null }) {
  const eslogan = config?.eslogan || SITE.eslogan;
  const heroImg = config?.hero_imagen_url;

  return (
    <section className="relative overflow-hidden bg-[#1B5E20] text-white">
      {heroImg ? (
        <Image
          src={heroImg}
          alt={`Foto de ${SITE.candidato}`}
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#0d3311]"
        />
      )}
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 py-20 sm:py-28">
        <p className="rounded-full bg-[#C6D92E] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#1B5E20]">
          {SITE.cargo} — {SITE.departamento}
        </p>
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight sm:text-6xl">
          {eslogan}
        </h1>
        <p className="max-w-xl text-base text-white/90 sm:text-lg">
          Soy {SITE.candidato}. Camino el territorio, escucho a la gente y
          gobierno con honestidad campesina. Conoce las noticias, columnas y
          propuestas de esta campaña.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/propuestas"
            className="rounded-full bg-[#C6D92E] px-6 py-3 font-bold text-[#1B5E20] shadow-lg transition hover:bg-[#D4E157]"
          >
            Conoce las propuestas
          </Link>
          <Link
            href="/contacto"
            className="rounded-full border-2 border-white/70 px-6 py-3 font-bold text-white transition hover:bg-white hover:text-[#1B5E20]"
          >
            Únete como voluntario
          </Link>
        </div>
      </div>
      {/* Onda blanca de abajo, solo es adorno para separar del siguiente bloque */}
      <svg viewBox="0 0 1440 60" aria-hidden="true" className="relative block w-full text-[#F5F5ED]">
        <path
          d="M0 32c240-24 480-24 720 0s480 24 720 0v28H0V32Z"
          fill="currentColor"
        />
      </svg>
    </section>
  );
}
