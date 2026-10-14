import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// OG genérico del sitio (WhatsApp / Facebook / X)
export default async function OgImage() {
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
          background: "#1B5E20",
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
            fontSize: 28,
            width: "fit-content",
          }}
        >
          {SITE.cargo}
        </div>
        <div style={{ fontSize: 72, fontWeight: 900, marginTop: 24, lineHeight: 1.1 }}>
          {SITE.candidato}
        </div>
        <div style={{ fontSize: 40, marginTop: 16, color: "#D4E157" }}>{SITE.eslogan}</div>
      </div>
    ),
    { ...size },
  );
}
