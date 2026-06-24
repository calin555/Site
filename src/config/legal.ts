export const legalPaths = {
  terms: "/termeni-si-conditii",
  privacy: "/politica-de-confidentialitate",
  gdpr: "/politica-gdpr",
} as const;

export type LegalPathKey = keyof typeof legalPaths;
