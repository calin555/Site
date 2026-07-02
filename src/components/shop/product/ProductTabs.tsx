"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ProductDescription } from "./ProductDescription";
import { ProductSpecs } from "./ProductSpecs";
import { ProductDownloads } from "./ProductDownloads";
import { ProductReviews } from "./ProductReviews";
import { ProductCommercialPanel } from "./ProductCommercialPanel";
import type { ProductDetail } from "@/types/product";

type TabId = "description" | "guide" | "specs" | "downloads" | "reviews";

interface ProductTabsProps {
  product: ProductDetail;
}

const TABS: { id: TabId; label: string }[] = [
  { id: "description", label: "Descriere" },
  { id: "guide", label: "Potrivit pentru" },
  { id: "specs", label: "Specificații" },
  { id: "downloads", label: "Documente" },
  { id: "reviews", label: "Recenzii" },
];

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("description");

  useEffect(() => {
    if (window.location.hash === "#recenzii") {
      setActiveTab("reviews");
    }
  }, []);

  return (
    <div className="min-w-0 max-w-full">
      <div
        role="tablist"
        aria-label="Detalii produs"
        className="-mx-1 flex max-w-full gap-1 overflow-x-auto border-b border-surface-200 px-1 [-webkit-overflow-scrolling:touch]"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative shrink-0 px-4 py-3 text-sm font-semibold transition-colors",
              activeTab === tab.id
                ? "text-brand-700"
                : "text-surface-500 hover:text-surface-900"
            )}
          >
            {tab.label}
            {tab.id === "reviews" && product.reviewCount > 0 && (
              <span className="ml-1.5 rounded-full bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-600">
                {product.reviewCount}
              </span>
            )}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-brand-500 to-accent" />
            )}
          </button>
        ))}
      </div>

      <div className="py-8">
        {activeTab === "description" && (
          <div role="tabpanel" id="panel-description">
            <ProductDescription description={product.description} />
          </div>
        )}
        {activeTab === "guide" && (
          <div role="tabpanel" id="panel-guide">
            <ProductCommercialPanel product={product} />
          </div>
        )}
        {activeTab === "specs" && (
          <div role="tabpanel" id="panel-specs">
            <ProductSpecs specs={product.specs} />
          </div>
        )}
        {activeTab === "downloads" && (
          <div role="tabpanel" id="panel-downloads">
            <ProductDownloads documents={product.documents} productName={product.name} />
          </div>
        )}
        {activeTab === "reviews" && (
          <div role="tabpanel" id="recenzii">
            <ProductReviews
              reviews={product.reviews}
              averageRating={product.averageRating}
              reviewCount={product.reviewCount}
            />
          </div>
        )}
      </div>
    </div>
  );
}
