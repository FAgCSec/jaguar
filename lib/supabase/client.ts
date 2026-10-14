import { createBrowserClient } from "@supabase/ssr";

// Conexion a la base desde el navegador (para subir fotos, login, etc).
// Usa las claves publicas del .env. No poner aqui la clave privada.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
