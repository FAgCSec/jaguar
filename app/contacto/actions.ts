"use server";

import { createClient } from "@/lib/supabase/server";

function esEmailValido(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

async function verificarCaptcha(token: string | null, ip: string | null): Promise<boolean> {
  // Si no hay claves configuradas, se permite (el honeypot sigue activo).
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const hcaptchaSecret = process.env.HCAPTCHA_SECRET_KEY;
  if (!turnstileSecret && !hcaptchaSecret) return true;
  if (!token) return false;
  try {
    if (turnstileSecret) {
      const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: turnstileSecret, response: token, remoteip: ip ?? "" }),
      });
      const j = await r.json();
      if (j.success) return true;
    }
    if (hcaptchaSecret) {
      const r = await fetch("https://api.hcaptcha.com/siteverify", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: hcaptchaSecret, response: token, remoteip: ip ?? "" }),
      });
      const j = await r.json();
      if (j.success) return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function enviarMensaje(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const nombre = String(formData.get("nombre") ?? "").trim().slice(0, 120);
  const whatsapp = String(formData.get("whatsapp") ?? "").trim().slice(0, 20);
  const email = String(formData.get("email") ?? "").trim().slice(0, 160);
  const municipio = String(formData.get("municipio") ?? "").trim().slice(0, 80);
  const mensaje = String(formData.get("mensaje") ?? "").trim().slice(0, 2000);
  const honeypot = String(formData.get("empresa") ?? "").trim();
  const captchaToken =
    String(formData.get("cf-turnstile-response") ?? formData.get("h-captcha-response") ?? "") || null;

  // Honeypot: los bots lo llenan, los humanos no.
  if (honeypot) return { ok: true };
  if (!nombre || !whatsapp || !mensaje) return { ok: false, error: "Faltan campos." };
  if (!/^[0-9+\s()-]{7,20}$/.test(whatsapp)) return { ok: false, error: "WhatsApp inválido." };
  if (email && !esEmailValido(email)) return { ok: false, error: "Email inválido." };

  const captchaOk = await verificarCaptcha(captchaToken, null);
  if (!captchaOk) return { ok: false, error: "Verificación anti-spam fallida." };

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { ok: false, error: "Formulario no configurado (falta Supabase)." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    nombre,
    whatsapp,
    email: email || null,
    municipio: municipio || null,
    mensaje,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
