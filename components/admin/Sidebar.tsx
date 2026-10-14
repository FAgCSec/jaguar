import Link from "next/link";
import {
  BarChart3,
  FileText,
  Images,
  Inbox,
  LayoutDashboard,
  MessagesSquare,
  Newspaper,
  PenLine,
  User,
  type LucideIcon,
} from "lucide-react";

// Enlaces del menu lateral del admin. Para agregar una seccion nueva, añadirla aqui.
export const ADMIN_LINKS: { href: string; label: string; Icono: LucideIcon }[] = [
  { href: "/admin", label: "Panel", Icono: LayoutDashboard },
  { href: "/admin/noticias", label: "Noticias", Icono: Newspaper },
  { href: "/admin/columnas", label: "Columnas", Icono: PenLine },
  { href: "/admin/propuestas", label: "Propuestas", Icono: FileText },
  { href: "/admin/galeria", label: "Galería", Icono: Images },
  { href: "/admin/testimonios", label: "Testimonios", Icono: MessagesSquare },
  { href: "/admin/estadisticas", label: "Estadísticas", Icono: BarChart3 },
  { href: "/admin/sobre-mi", label: "Sobre mí", Icono: User },
  { href: "/admin/mensajes", label: "Mensajes", Icono: Inbox },
];

// Menu lateral del panel. En celular sale arriba en horizontal, en compu al lado.
// Si hay mensajes sin leer, muestra el numero al lado de Mensajes.
export function Sidebar({ pendientes }: { pendientes: number }) {
  return (
    <aside className="w-full shrink-0 bg-[#1B5E20] text-white lg:min-h-screen lg:w-60">
      <div className="flex items-center justify-between p-4 lg:block">
        <Link href="/admin" className="font-extrabold">
          Panel de campaña
        </Link>
        <Link href="/" className="text-xs underline opacity-80 lg:mt-1 lg:block">
          Ver sitio público
        </Link>
      </div>
      <nav aria-label="Administración" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col">
        {ADMIN_LINKS.map(({ href, label, Icono }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold hover:bg-white/10"
          >
            <Icono size={17} className="shrink-0" />
            {label}
            {href === "/admin/mensajes" && pendientes > 0 && (
              <span className="ml-auto rounded-full bg-[#C6D92E] px-2 py-0.5 text-xs font-bold text-[#1B5E20]">
                {pendientes}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
