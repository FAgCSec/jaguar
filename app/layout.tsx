import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Analytics } from "@/components/public/Analytics";
import { SITE } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${SITE.candidato} — ${SITE.eslogan}`,
    template: `%s | ${SITE.candidato}`,
  },
  description: SITE.descripcion,
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: SITE.candidato,
    title: `${SITE.candidato} — ${SITE.eslogan}`,
    description: SITE.descripcion,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[#C6D92E] focus:px-4 focus:py-2 focus:font-bold focus:text-[#1B5E20]"
        >
          Saltar al contenido
        </a>
        <Header />
        <div id="contenido" className="flex-1 pt-[68px]">
          {children}
        </div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
