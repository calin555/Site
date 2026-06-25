import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { buildRootMetadata } from "@/lib/seo/metadata";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { MobileWebViewFix } from "@/components/layout/MobileWebViewFix";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = buildRootMetadata();

/** Explicit viewport for mobile + Facebook/Instagram in-app WebViews (iOS Safari). */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  viewportFit: "auto",
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <head>
        <GoogleAnalytics />
      </head>
      <body
        className={`${inter.variable} w-full max-w-full overflow-x-hidden font-sans antialiased`}
      >
        <MobileWebViewFix />
        {children}
      </body>
    </html>
  );
}
