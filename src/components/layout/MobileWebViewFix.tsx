"use client";

import { useEffect } from "react";

function isInAppSocialBrowser(): boolean {
  const ua = navigator.userAgent;
  return /FBAN|FBAV|Instagram|FB_IAB|Line\/|Twitter/i.test(ua);
}

function resetHorizontalScroll() {
  window.scrollTo(0, window.scrollY);
  document.documentElement.scrollLeft = 0;
  document.body.scrollLeft = 0;
}

/** Facebook/Instagram WebViews often report the wrong layout width — force innerWidth. */
function syncInAppViewport() {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) return;

  const width = window.innerWidth;
  viewport.setAttribute(
    "content",
    `width=${width}, initial-scale=1, minimum-scale=1, maximum-scale=5, viewport-fit=auto`
  );
}

export function MobileWebViewFix() {
  useEffect(() => {
    if (!isInAppSocialBrowser()) return;

    document.documentElement.classList.add("in-app-browser");
    syncInAppViewport();
    resetHorizontalScroll();

    function onViewportChange() {
      syncInAppViewport();
      resetHorizontalScroll();
    }

    window.addEventListener("orientationchange", onViewportChange);
    window.addEventListener("resize", onViewportChange);

    return () => {
      window.removeEventListener("orientationchange", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
      document.documentElement.classList.remove("in-app-browser");
    };
  }, []);

  return null;
}
