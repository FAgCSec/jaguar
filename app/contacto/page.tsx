import type { Metadata } from "next";
import { ContactForm } from "@/components/public/ContactForm";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = { title: "Contacto" };

export default function ContactoPage() {
  const wa = `https://wa.me/57${SITE.whatsapp}`;
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-[#1B5E20]">Contacto</h1>
      <p className="mt-1 text-sm text-[#1A1A1A]/70">
        Escríbenos para ser voluntario, invitar al candidato o compartir tu propuesta.
      </p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="grid content-start gap-3">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-[#2E7D32] p-5 font-bold text-white shadow hover:bg-[#1B5E20]"
          >
            💬 Escríbenos por WhatsApp
            <span className="block text-sm font-normal text-white/85">{SITE.telefonoMostrado}</span>
          </a>
          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="font-bold text-[#1B5E20]">Sede de campaña</p>
            <p className="mt-1 text-sm">📍 {SITE.direccion}</p>
            <p className="mt-1 text-sm">📧 {SITE.email}</p>
          </div>
        </div>
        <ContactForm />
      </div>
    </main>
  );
}
