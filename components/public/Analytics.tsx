"use client";

import Script from "next/script";

/**
 * Analytics ligero y privado (Umami o Plausible).
 * Se activa solo si hay variables de entorno configuradas.
 */
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
