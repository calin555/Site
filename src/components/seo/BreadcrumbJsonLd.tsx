import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/seo/structured-data";

interface BreadcrumbJsonLdProps {
  items: { name: string; path?: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  return <JsonLd data={buildBreadcrumbSchema(items)} />;
}
