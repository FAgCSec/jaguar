import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

// Este archivo se ejecuta antes de mostrar cualquier pagina.
// Solo sirve para refrescar la sesion del admin. No bloquear nada aqui.
export default async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
