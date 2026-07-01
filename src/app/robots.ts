import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt"],
        disallow: [
          "/admin/",
          "/api/",
          "/cont/",
          "/cos",
          "/checkout/",
          "/autentificare/",
        ],
      },
    ],
    sitemap: [
      absoluteUrl("/sitemap.xml"),
      absoluteUrl("/sitemap-products.xml"),
      absoluteUrl("/sitemap-images.xml"),
    ],
    host: absoluteUrl(),
  };
}
