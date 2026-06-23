import { getFeaturedPosts } from "@/lib/services/blog.service";
import { toLegacyPost } from "@/types/blog";
import { getAllCatalogProducts } from "@/lib/services/catalog.service";
import { getShopCategories } from "@/lib/services/category.service";
import {
  brands,
  testimonials,
} from "@/lib/mock-data";
import { HeroBanner } from "@/components/shop/home/HeroBanner";
import { CategoriesSection } from "@/components/shop/home/CategoriesSection";
import { FeaturedProductsSection } from "@/components/shop/home/FeaturedProductsSection";
import { BrandsSection } from "@/components/shop/home/BrandsSection";
import { BenefitsSection } from "@/components/shop/home/BenefitsSection";
import { TestimonialsSection } from "@/components/shop/home/TestimonialsSection";
import { BlogSection } from "@/components/shop/home/BlogSection";
import { ContactCTA } from "@/components/shop/home/ContactCTA";
import { getSiteContactSettings } from "@/lib/services/site-contact.service";

export default async function HomePage() {
  const [allProducts, categories, contact] = await Promise.all([
    getAllCatalogProducts(),
    getShopCategories(),
    getSiteContactSettings(),
  ]);
  const featured = allProducts.filter((p) => p.isFeatured);
  const heroProduct = featured[0] ?? allProducts[0];
  const latestPosts = getFeaturedPosts(3).map(toLegacyPost);

  return (
    <>
      <HeroBanner heroProduct={heroProduct} />
      <CategoriesSection categories={categories} />
      <FeaturedProductsSection products={featured} />
      <BrandsSection brands={brands} />
      <BenefitsSection />
      <TestimonialsSection testimonials={testimonials} />
      <BlogSection posts={latestPosts} />
      <ContactCTA contact={contact} />
    </>
  );
}
