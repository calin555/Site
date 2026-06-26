/** Domeniul principal — canonical SEO, sitemap, metadata. */
export const PRIMARY_DOMAIN = "incarauto.ro";

/** Toate domeniile care servesc același site (fără www). */
export const SITE_DOMAINS = ["incarauto.ro", "incarcareauto.ro"] as const;

export type SiteDomain = (typeof SITE_DOMAINS)[number];
