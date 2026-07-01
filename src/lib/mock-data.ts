import { getLegacyBlogPosts } from "@/lib/services/blog.service";
import type { LegacyBlogPost } from "@/types/blog";

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  category: string;
  categorySlug: string;
  brand: string;
  powerKw: number;
  phases: "SINGLE" | "THREE";
  connectorTypes: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

/** @deprecated Use blog.service */
export type BlogPost = LegacyBlogPost;

export const categories: Category[] = [
  {
    id: "1",
    name: "Stații AC",
    slug: "statii-ac",
    description: "Încărcare alternativă pentru uz rezidențial și comercial, 7.4–22 kW.",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938ca?w=600&h=400&fit=crop",
    productCount: 24,
  },
  {
    id: "2",
    name: "Stații DC",
    slug: "statii-dc",
    description: "Încărcare rapidă DC pentru flote, parcări publice și centre comerciale.",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop",
    productCount: 12,
  },
  {
    id: "3",
    name: "Accesorii",
    slug: "accesorii",
    description: "Cabluri, conectori, protecții și accesorii pentru instalare completă.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    productCount: 38,
  },
  {
    id: "4",
    name: "Smart & OCPP",
    slug: "smart-ocpp",
    description: "Stații inteligente cu management la distanță și protocol OCPP.",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=400&fit=crop",
    productCount: 16,
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "ChargePro Home 7.4 kW",
    slug: "chargepro-home-7-4kw",
    shortDescription: "Stație wallbox monofazată pentru încărcare acasă.",
    description:
      "Stație de încărcare compactă, ideală pentru garaj sau curte. Instalare simplă, protecție IP54, conectivitate WiFi și aplicație mobilă pentru monitorizare consum.",
    price: 2899,
    compareAtPrice: 3299,
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938ca?w=800&h=600&fit=crop",
    category: "Stații AC",
    categorySlug: "statii-ac",
    brand: "ChargePro",
    powerKw: 7.4,
    phases: "SINGLE",
    connectorTypes: ["Type 2"],
    isFeatured: true,
    stock: 15,
  },
  {
    id: "2",
    name: "ChargePro Pro 22 kW",
    slug: "chargepro-pro-22kw",
    shortDescription: "Performanță trifazată pentru flote și spații comerciale.",
    description:
      "Stație trifazată de înaltă performanță cu RFID, OCPP 1.6J și load balancing dinamic. Ideală pentru parcări de firmă și centre logistice.",
    price: 5499,
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&h=600&fit=crop",
    category: "Stații AC",
    categorySlug: "statii-ac",
    brand: "ChargePro",
    powerKw: 22,
    phases: "THREE",
    connectorTypes: ["Type 2"],
    isFeatured: true,
    isNew: true,
    stock: 8,
  },
  {
    id: "3",
    name: "VoltEdge DC 60 kW",
    slug: "voltedge-dc-60kw",
    shortDescription: "Încărcare rapidă DC pentru stații publice.",
    description:
      "Stație DC fast charging cu două conectori simultani CCS2. Ecran tactil 15\", management cloud și certificare MID pentru facturare.",
    price: 89900,
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop",
    category: "Stații DC",
    categorySlug: "statii-dc",
    brand: "VoltEdge",
    powerKw: 60,
    phases: "THREE",
    connectorTypes: ["CCS2"],
    isFeatured: true,
    stock: 3,
  },
  {
    id: "4",
    name: "Cablu Type 2 — 7.5m",
    slug: "cablu-type2-7-5m",
    shortDescription: "Cablu premium Type 2, 32A, lungime 7.5 metri.",
    description:
      "Cablu de încărcare rezistent la UV și temperaturi extreme. Mufe ergonomice, compatibil cu toate stațiile Type 2.",
    price: 649,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    category: "Accesorii",
    categorySlug: "accesorii",
    brand: "ChargePro",
    powerKw: 22,
    phases: "THREE",
    connectorTypes: ["Type 2"],
    stock: 42,
  },
  {
    id: "5",
    name: "SmartBox OCPP Gateway",
    slug: "smartbox-ocpp-gateway",
    shortDescription: "Modul de management OCPP pentru stații existente.",
    description:
      "Adaugă conectivitate cloud și billing la stațiile tale existente. Compatibil OCPP 1.6J și 2.0.1, integrare API REST.",
    price: 1899,
    compareAtPrice: 2199,
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=600&fit=crop",
    category: "Smart & OCPP",
    categorySlug: "smart-ocpp",
    brand: "ChargePro",
    powerKw: 0,
    phases: "SINGLE",
    connectorTypes: [],
    isNew: true,
    stock: 20,
  },
  {
    id: "6",
    name: "ChargePro Wall 11 kW",
    slug: "chargepro-wall-11kw",
    shortDescription: "Design premium, montaj pe perete, încărcare rapidă.",
    description:
      "Stație cu design minimalist, iluminare LED de status, protecție RCBO integrată și garanție 3 ani.",
    price: 3799,
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938ca?w=800&h=600&fit=crop",
    category: "Stații AC",
    categorySlug: "statii-ac",
    brand: "ChargePro",
    powerKw: 11,
    phases: "THREE",
    connectorTypes: ["Type 2"],
    stock: 12,
  },
];


export const blogPosts: BlogPost[] = getLegacyBlogPosts();

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  productCount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  avatar: string;
}

export const brands: Brand[] = [
  { id: "1", name: "ChargePro", slug: "chargepro", logo: "CP", productCount: 18 },
  { id: "2", name: "VoltEdge", slug: "voltedge", logo: "VE", productCount: 9 },
  { id: "3", name: "EcoWatt", slug: "ecowatt", logo: "EW", productCount: 12 },
  { id: "4", name: "PowerLink", slug: "powerlink", logo: "PL", productCount: 7 },
  { id: "5", name: "SmartCharge", slug: "smartcharge", logo: "SC", productCount: 11 },
  { id: "6", name: "GridFlow", slug: "gridflow", logo: "GF", productCount: 6 },
];

export const testimonials: Testimonial[] = [];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}
