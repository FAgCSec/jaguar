import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";

// Pie de pagina con datos, enlaces y redes. Sale en todas las paginas.
// Los datos salen de lib/constants.ts, no escribirlos aqui a mano.
export function Footer() {
  return (
    <footer className="bg-[#1B5E20] text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold">{SITE.candidato}</p>
          <p className="mt-1 text-sm text-[#D4E157]">{SITE.eslogan}</p>
          <p className="mt-3 text-sm text-white/80">
            {SITE.cargo} — {SITE.departamento}.
          </p>
        </div>
        <nav aria-label="Enlaces">
          <p className="text-sm font-bold uppercase tracking-wide text-[#D4E157]">
            Explora
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/85 hover:text-white hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#D4E157]">
            Contacto y redes
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-white/85">
            <li className="flex items-center gap-2"><Mail size={15} className="shrink-0 text-[#D4E157]" /> {SITE.email}</li>
            <li className="flex items-center gap-2"><Phone size={15} className="shrink-0 text-[#D4E157]" /> {SITE.telefonoMostrado}</li>
            <li className="flex items-center gap-2"><MapPin size={15} className="shrink-0 text-[#D4E157]" /> {SITE.direccion}</li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              ["Facebook", SITE.redes.facebook],
              ["X", SITE.redes.x],
              ["Instagram", SITE.redes.instagram],
              ["YouTube", SITE.redes.youtube],
              ["TikTok", SITE.redes.tiktok],
            ].map(([nombre, url]) => (
              <a
                key={nombre}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-[#C6D92E] hover:text-[#1B5E20]"
              >
                {nombre}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-white/70">
          © {new Date().getFullYear()} {SITE.candidato} — {SITE.eslogan}. Sitio
          informativo de campaña.
        </p>
      </div>
    </footer>
  );
}
