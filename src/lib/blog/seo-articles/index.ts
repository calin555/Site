import type { SeoArticleSeed } from "./types";
import { GHIDURI_EV_ARTICLES } from "./ghiduri-ev";
import { INSTALARE_ARTICLES } from "./instalare";
import { FINANTARI_ARTICLES } from "./finantari";
import { COMPARATII_ARTICLES } from "./comparatii";
import { COSTURI_ARTICLES } from "./costuri";

export type { SeoArticleSeed } from "./types";
export { SEO_ARTICLE_TAGS } from "./tags";

export const SEO_ARTICLES: SeoArticleSeed[] = [
  ...GHIDURI_EV_ARTICLES,
  ...INSTALARE_ARTICLES,
  ...FINANTARI_ARTICLES,
  ...COMPARATII_ARTICLES,
  ...COSTURI_ARTICLES,
];

export function getSeoArticleBySlug(slug: string): SeoArticleSeed | undefined {
  return SEO_ARTICLES.find((a) => a.slug === slug);
}
