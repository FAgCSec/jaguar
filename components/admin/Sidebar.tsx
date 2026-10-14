import Link from "next/link";

export const ADMIN_LINKS = [
  { href: "/admin", label: "📊 Panel" },
  { href: "/admin/noticias", label: "📰 Noticias" },
  { href: "/admin/columnas", label: "✍️ Columnas" },
  { href: "/admin/propuestas", label: "📄 Propuestas" },
  { href: "/admin/galeria", label: "🖼️ Galería" },
  { href: "/admin/testimonios", label: "💬 Testimonios" },
  { href: "/admin/estadisticas", label: "📈 Estadísticas" },
  { href: "/admin/sobre-mi", label: "👤 Sobre mí" },
  { href: "/admin/mensajes", label: "✉️ Mensajes" },
];

export function Sidebar({ pendientes }: { pendientes: number }) {
  return (
    <aside className="w-full shrink-0 bg-[#1B5E20] text-white lg:min-h-screen lg:w-60">
      <div className="flex items-center justify-between p-4 lg:block">
        <Link href="/admin" className="font-extrabold">
          🌱 Panel de campaña
        </Link>
        <Link href="/" className="text-xs underline opacity-80 lg:mt-1 lg:block">
          ← Ver sitio público
        </Link>
      </div>
      <nav aria-label="Administración" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col">
        {ADMIN_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold hover:bg-white/10"
          >
            {l.label}
            {l.href === "/admin/mensajes" && pendientes > 0 && (
              <span className="ml-2 rounded-full bg-[#C6D92E] px-2 py-0.5 text-xs font-bold text-[#1B5E20]">
                {pendientes}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
