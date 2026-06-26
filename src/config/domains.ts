/** Domeniul principal — canonical SEO, sitemap, metadata. */
export const PRIMARY_DOMAIN = "incarcauto.ro";

/** Toate domeniile care servesc același site (fără www). */
export const SITE_DOMAINS = ["incarcauto.ro", "incarcareauto.ro"] as const;

export type SiteDomain = (typeof SITE_DOMAINS)[number];
