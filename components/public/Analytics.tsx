"use client";

import Script from "next/script";

// Mide visitas sin usar cookies invasivas. Solo se activa si hay claves en el .env.
// Acepta Umami o Plausible, el que este configurado.
export function Analytics() {
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <>
      {umamiUrl && umamiId && (
        <Script
          src={umamiUrl}
          data-website-id={umamiId}
          strategy="afterInteractive"
        />
      )}
      {plausibleDomain && (
        <Script
          src="https://plausible.io/js/script.js"
          data-domain={plausibleDomain}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
