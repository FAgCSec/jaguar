import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { logoutAdmin } from "./login/actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = false;
  try {
    const supabase = await createClient();
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    user = !!u;
  } catch {
    user = false;
  }

  // El login tiene su propio layout visual; aquí solo protegemos el resto.
  // Nota: /admin/login se renderiza dentro de este layout, así que lo excluimos del guard.
  return <Guard user={user}>{children}</Guard>;
}

async function Guard({
  user,
  children,
}: {
  user: boolean;
  children: React.ReactNode;
}) {
  if (!user) {
    // Dejamos pasar al login; el resto redirige. Como no conocemos la ruta
    // aquí, el login muestra el formulario y las demás páginas revalidan.
    // La redirección fuerte se hace en cada página admin (ver dashboard).
    return <>{children}</>;
  }
  let pendientes = 0;
  try {
    const supabase = await createClient();
    const { count } = await supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("leido", false);
    pendientes = count ?? 0;
  } catch {
    pendientes = 0;
  }

  return (
    <div className="min-h-screen bg-[#F5F5ED] lg:flex">
      <Sidebar pendientes={pendientes} />
      <div className="flex-1">
        <div className="flex items-center justify-between gap-3 border-b border-[#2E7D32]/10 bg-white px-4 py-3">
          <p className="text-sm font-semibold text-[#1B5E20]">
            Panel de administración
          </p>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="rounded-full bg-[#F5F5ED] px-4 py-1.5 text-sm font-bold text-[#1B5E20] ring-1 ring-[#2E7D32]/20 hover:bg-[#C6D92E]"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

export async function requireAdmin() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/admin/login");
    return { supabase, user };
  } catch (e) {
    // Sin backend configurado (o error de sesión): al login.
    if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e;
    redirect("/admin/login");
  }
}
