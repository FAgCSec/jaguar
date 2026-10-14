"use client";

import { useActionState } from "react";
import { loginAdmin } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, undefined);
  return (
    <form action={action} className="grid gap-4 rounded-3xl bg-white p-8 shadow-xl">
      <div className="text-center">
        <p aria-hidden="true" className="text-4xl">🌱</p>
        <h1 className="mt-2 text-xl font-extrabold text-[#1B5E20]">Acceso del equipo</h1>
        <p className="text-sm text-[#1A1A1A]/70">
          Solo administradores (1-2 cuentas). Activa 2FA en Supabase para mayor seguridad.
        </p>
      </div>
      <label className="grid gap-1 text-sm font-semibold">
        Correo
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          placeholder="equipo@campana.com"
          className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal outline-none ring-1 ring-[#2E7D32]/20 focus:ring-2 focus:ring-[#2E7D32]"
        />
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        Contraseña
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal outline-none ring-1 ring-[#2E7D32]/20 focus:ring-2 focus:ring-[#2E7D32]"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#1B5E20] px-6 py-3 font-bold text-white hover:bg-[#2E7D32] disabled:opacity-60"
      >
        {pending ? "Verificando…" : "Entrar al panel"}
      </button>
      {state?.error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
          {state.error}
        </p>
      )}
    </form>
  );
}
