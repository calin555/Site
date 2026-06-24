export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  couponCode?: string;
}

import type { StockStatus } from "@/lib/catalog/stock-status";

export interface CartLineItem {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  lineTotal: number;
  stock: number;
  stockStatus: StockStatus;
  sku: string;
}

export interface CartSummary {
  items: CartLineItem[];
  itemCount: number;
  couponCode?: string;
  couponError?: string;
}
