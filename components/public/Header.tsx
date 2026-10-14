"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#1B5E20] text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 lg:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Inicio">
          {/* Logo placeholder: inicial del candidato */}
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C6D92E] text-xl font-extrabold text-[#1B5E20]"
          >
            {SITE.candidatoCorto.charAt(0)}
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold sm:text-lg">
              {SITE.candidato}
            </span>
            <span className="block text-xs text-[#D4E157] sm:text-sm">
              {SITE.eslogan}
            </span>
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
              className={cn(
                "whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-colors hover:bg-white/10 xl:px-4",
                pathname === l.href && "bg-[#C6D92E] text-[#1B5E20]",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/propuestas"
            className="hidden whitespace-nowrap rounded-full bg-[#C6D92E] px-4 py-2 text-sm font-bold text-[#1B5E20] transition hover:bg-[#D4E157] xl:inline-block"
          >
            Conoce las propuestas
          </Link>
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
          >
            {abierto ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {abierto && (
        <nav aria-label="Móvil" className="space-y-1 border-t border-white/10 px-4 py-3 lg:hidden">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setAbierto(false)}
              className={cn(
                "block rounded-xl px-3 py-2.5 font-semibold hover:bg-white/10",
                pathname === l.href && "bg-[#C6D92E] text-[#1B5E20]",
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/propuestas"
            onClick={() => setAbierto(false)}
            className="mt-2 block rounded-xl bg-[#C6D92E] px-3 py-2.5 text-center font-bold text-[#1B5E20]"
          >
            Conoce las propuestas
          </Link>
        </nav>
      )}
    </header>
  );
}
