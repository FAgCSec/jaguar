import type { MetadataRoute } from "next";

// Dice a Google que puede entrar a todo menos al /admin, y donde esta el mapa del sitio.
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
