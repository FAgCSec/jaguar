"use client";

import { useState } from "react";
import { CircleAlert, CircleCheck, Hand } from "lucide-react";
import { enviarMensaje } from "@/app/contacto/actions";

export function ContactForm() {
  const [estado, setEstado] = useState<"idle" | "ok" | "error">("idle");
  const [cargando, setCargando] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);
    setEstado("idle");
    const fd = new FormData(e.currentTarget);
    const res = await enviarMensaje(fd);
    setCargando(false);
    if (res.ok) {
      setEstado("ok");
      e.currentTarget.reset();
    } else {
      setEstado("error");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-[#2E7D32]/10 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold">
          Nombre completo *
          <input
            name="nombre"
            required
            maxLength={120}
            autoComplete="name"
            placeholder="Ej. Ana Pérez"
            className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal ring-1 ring-[#2E7D32]/15 outline-none focus:ring-2 focus:ring-[#2E7D32]"
          />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          WhatsApp *
          <input
            name="whatsapp"
            required
            maxLength={20}
            inputMode="tel"
            autoComplete="tel"
            placeholder="Ej. 3001234567"
            className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal ring-1 ring-[#2E7D32]/15 outline-none focus:ring-2 focus:ring-[#2E7D32]"
          />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Correo electrónico
          <input
            name="email"
            type="email"
            maxLength={160}
            autoComplete="email"
            placeholder="Ej. ana@correo.com"
            className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal ring-1 ring-[#2E7D32]/15 outline-none focus:ring-2 focus:ring-[#2E7D32]"
          />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Municipio
          <input
            name="municipio"
            maxLength={80}
            autoComplete="address-level2"
            placeholder="Ej. San José"
            className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal ring-1 ring-[#2E7D32]/15 outline-none focus:ring-2 focus:ring-[#2E7D32]"
          />
        </label>
      </div>
      <label className="grid gap-1 text-sm font-semibold">
        Mensaje / ¿Cómo quieres ayudar? *
        <textarea
          name="mensaje"
          required
          rows={5}
          maxLength={2000}
          placeholder="Cuéntanos cómo te quieres sumar a la campaña…"
          className="rounded-xl bg-[#F5F5ED] px-4 py-2.5 font-normal ring-1 ring-[#2E7D32]/15 outline-none focus:ring-2 focus:ring-[#2E7D32]"
        />
      </label>
      {/* Honeypot anti-spam simple (además de Turnstile/hCaptcha opcional) */}
      <input type="text" name="empresa" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <p className="text-xs text-[#1A1A1A]/60">
          Este formulario está protegido por Cloudflare Turnstile.
        </p>
      )}
      <button
        type="submit"
        disabled={cargando}
        className="flex items-center justify-center gap-2 rounded-full bg-[#C6D92E] px-6 py-3 font-bold text-[#1B5E20] shadow transition hover:bg-[#D4E157] disabled:opacity-60"
      >
        {cargando ? "Enviando…" : (<>Quiero ser voluntario <Hand size={18} /></>)}
      </button>
      {estado === "ok" && (
        <p role="status" className="flex items-start gap-2 rounded-xl bg-[#f1f8e9] p-3 text-sm font-semibold text-[#1B5E20]">
          <CircleCheck size={18} className="mt-0.5 shrink-0" />
          ¡Gracias! Recibimos tu mensaje y pronto te contactaremos por WhatsApp.
        </p>
      )}
      {estado === "error" && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
          <CircleAlert size={18} className="mt-0.5 shrink-0" />
          No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos por WhatsApp.
        </p>
      )}
    </form>
  );
}
