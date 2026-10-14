"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Entrada y salida del panel.
// Por seguridad solo deja 5 intentos cada 10 minutos por correo. Si se pasa, toca esperar.
// Los mensajes de error explican si fue clave mala o si el correo no esta confirmado.
const intentos = new Map<string, { n: number; hasta: number }>();
const MAX_INTENTOS = 5;
const VENTANA_MS = 10 * 60 * 1000;

function ipKey(ip: string | null) {
  return ip ?? "desconocida";
}

export async function loginAdmin(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  // En server actions no hay IP directa; usamos una clave global + email.
  const key = ipKey(email);
  const ahora = Date.now();
  const reg = intentos.get(key);
  if (reg && reg.hasta > ahora && reg.n >= MAX_INTENTOS) {
    const min = Math.ceil((reg.hasta - ahora) / 60000);
    return { error: `Demasiados intentos. Espera ${min} min antes de reintentar.` };
  }
  if (!email || !password) return { error: "Escribe tu correo y contraseña." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const n = (reg && reg.hasta > ahora ? reg.n : 0) + 1;
    intentos.set(key, { n, hasta: ahora + VENTANA_MS });
    // Mensaje real de Supabase para diagnosticar (sin exponer datos sensibles).
    const detalle =
      error.message === "Invalid login credentials"
        ? "Correo o contraseña incorrectos, o el correo no está confirmado."
        : error.message;
    return { error: `No se pudo entrar (${detalle}). Intento ${n} de ${MAX_INTENTOS}.` };
  }
  intentos.delete(key);
  redirect("/admin");
}

// Cierra la sesion y devuelve al login
export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
