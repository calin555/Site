export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductSpec {
  label: string;
  value: string;
  group?: string;
}

export interface ProductDocument {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: "datasheet" | "manual" | "certificate" | "brochure";
  fileSize?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  title?: string;
  content: string;
  date: string;
  verified?: boolean;
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images: ProductImage[];
  category: string;
  categorySlug: string;
  brand: string;
  brandSlug: string;
  powerKw: number;
  phases: "SINGLE" | "THREE";
  connectorTypes: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  stock: number;
  warrantyYears: number;
  ipRating?: string;
  installationRequired: boolean;
  specs: ProductSpec[];
  documents: ProductDocument[];
  reviews: ProductReview[];
  averageRating: number;
  reviewCount: number;
}
