import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/data";
import { SITE } from "@/lib/constants";

export const runtime = "edge";

export default async function OgColumna({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug("columna", slug).catch(() => null);
  const titulo = post?.titulo ?? SITE.candidato;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0d3311",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "#C6D92E",
            color: "#1B5E20",
            fontWeight: 800,
            padding: "8px 24px",
            borderRadius: 999,
            fontSize: 26,
            width: "fit-content",
          }}
        >
          Columna de opinión · {SITE.candidato}
        </div>
        <div style={{ fontSize: 60, fontWeight: 900, marginTop: 24, lineHeight: 1.15 }}>
          {titulo.length > 110 ? titulo.slice(0, 110) + "…" : titulo}
        </div>
        <div style={{ fontSize: 32, marginTop: 16, color: "#D4E157" }}>{SITE.eslogan}</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
