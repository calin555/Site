/** Domeniul principal — canonical SEO, sitemap, metadata. */
export const PRIMARY_DOMAIN = "incarcareauto.ro";

/** Toate domeniile care servesc același site (fără www). */
export const SITE_DOMAINS = ["incarcareauto.ro", "incarcauto.ro"] as const;

export type SiteDomain = (typeof SITE_DOMAINS)[number];
