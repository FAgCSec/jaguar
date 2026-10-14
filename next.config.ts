import type { NextConfig } from "next";

// Ajustes generales de Next.js.
// remotePatterns: de donde se pueden cargar imagenes (Supabase y fotos de prueba).
// Lo de turbopack es para que Tailwind funcione bien en desarrollo.
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
