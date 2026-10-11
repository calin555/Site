import Script from "next/script";
import { seoConfig } from "@/config/seo";

/**
 * Google Analytics (gtag.js) încărcat după hidratare, ca să nu blocheze
 * randarea și să nu concureze cu resursele critice (LCP).
 * - configul inline rulează afterInteractive (coada dataLayer e gata devreme);
 * - gtag.js (~170 KB) se încarcă lazyOnload, când browserul e liber.
 */
export function GoogleAnalytics() {
  const gaId = seoConfig.gaMeasurementId;
  if (!gaId) return null;

  return (
    <>
      <Script id="google-analytics-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
      <Script
        id="google-analytics-gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="lazyOnload"
      />
    </>
  );
}
