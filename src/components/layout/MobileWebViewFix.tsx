import Script from "next/script";

/** Runs before paint — useEffect runs too late for Facebook WebView layout. */
const IN_APP_BROWSER_VIEWPORT_SCRIPT = `
(function () {
  var ua = navigator.userAgent || "";
  var isAndroid = /Android/i.test(ua);
  var isInApp =
    /FBAN|FBAV|FB_IAB|FB4A|FBIOS|MetaIAB|Instagram/i.test(ua) ||
    (isAndroid && /; wv\\)/.test(ua) && /Version\\/\\d+\\.\\d+/i.test(ua));

  if (!isInApp) return;

  document.documentElement.classList.add("in-app-browser");
  if (isAndroid) document.documentElement.classList.add("in-app-browser-android");

  function readWidth() {
    var vv = window.visualViewport;
    var values = [
      vv && vv.width,
      window.innerWidth,
      document.documentElement.clientWidth,
      document.body && document.body.clientWidth,
    ].filter(function (v) {
      return typeof v === "number" && v > 0;
    });

    return Math.round(Math.max.apply(null, values));
  }

  function applyViewportFix() {
    var meta = document.querySelector('meta[name="viewport"]');
    if (!meta) return;

    if (isAndroid) {
      meta.setAttribute(
        "content",
        "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, viewport-fit=auto"
      );
    } else {
      var width = readWidth();
      meta.setAttribute(
        "content",
        "width=" +
          width +
          ", initial-scale=1, minimum-scale=1, maximum-scale=5, viewport-fit=auto"
      );
    }

    document.documentElement.style.width = "100%";
    document.documentElement.style.overflowX = "hidden";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";

    if (document.body) {
      document.body.style.width = "100%";
      document.body.style.maxWidth = "100%";
      document.body.style.overflowX = "hidden";
      document.body.style.margin = "0";
    }

    document.documentElement.scrollLeft = 0;
    if (document.body) document.body.scrollLeft = 0;
  }

  applyViewportFix();
  document.addEventListener("DOMContentLoaded", applyViewportFix);
  window.addEventListener("orientationchange", function () {
    setTimeout(applyViewportFix, 150);
  });
  window.addEventListener("resize", applyViewportFix);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", applyViewportFix);
  }
  window.addEventListener("pageshow", applyViewportFix);
})();
`;

export function MobileWebViewFix() {
  return (
    <Script
      id="in-app-browser-viewport-fix"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: IN_APP_BROWSER_VIEWPORT_SCRIPT }}
    />
  );
}
