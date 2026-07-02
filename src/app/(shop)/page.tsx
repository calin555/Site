import { getFeaturedPosts } from "@/lib/services/blog.service";
import { toLegacyPost } from "@/types/blog";
import { getAllCatalogProducts } from "@/lib/services/catalog.service";
import { getShopCategories } from "@/lib/services/category.service";
import {
  brands,
  testimonials,
} from "@/lib/mock-data";
import { HeroBanner } from "@/components/shop/home/HeroBanner";
import { HomeSeoIntro } from "@/components/shop/home/HomeSeoIntro";
import { CategoriesSection } from "@/components/shop/home/CategoriesSection";
import { FeaturedProductsSection } from "@/components/shop/home/FeaturedProductsSection";
import { BrandsSection } from "@/components/shop/home/BrandsSection";
import { BenefitsSection } from "@/components/shop/home/BenefitsSection";
import { TestimonialsSection } from "@/components/shop/home/TestimonialsSection";
import { BlogSection } from "@/components/shop/home/BlogSection";
import { LocalCitiesGrid } from "@/components/seo/LocalCitiesGrid";
import { ContactCTA } from "@/components/shop/home/ContactCTA";
import { FaqSection } from "@/components/seo/FaqSection";
import { Container } from "@/components/shared/Container";
import { EV_FAQ_ITEMS } from "@/lib/seo/faq-content";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqPageSchema, buildHomePageSchema } from "@/lib/seo/structured-data";
import { getSiteContactSettings } from "@/lib/services/site-contact.service";

import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Stație încărcare mașini electrice — AC, DC & wallbox România",
  description:
    "Stație încărcare mașini electrice: wallbox AC, stații rapide DC și încărcătoare EV. Livrare România, instalare ANRE, consultanță gratuită și ghid complet stații încărcare.",
  path: "/",
  keywords: [
    "statie incarcare masini electrice",
    "stație încărcare mașini electrice",
    "stații încărcare EV",
    "stație încărcare AC",
    "stație încărcare DC",
    "wallbox România",
  ],
});

export default async function HomePage() {
  const [allProducts, categories, contact] = await Promise.all([
    getAllCatalogProducts(),
    getShopCategories(),
    getSiteContactSettings(),
  ]);
  const featured = allProducts.filter((p) => p.isFeatured);
  const heroProducts = (featured.length > 0 ? featured : allProducts).slice(0, 5);
  const latestPosts = getFeaturedPosts(3).map(toLegacyPost);

  return (
    <>
      <JsonLd
        data={[buildFaqPageSchema(EV_FAQ_ITEMS.slice(0, 4)), buildHomePageSchema()]}
      />
      <HeroBanner heroProducts={heroProducts} />
      <HomeSeoIntro />
      <CategoriesSection categories={categories} />
      <FeaturedProductsSection products={featured} />
      <BrandsSection brands={brands} />
      <BenefitsSection />
      {testimonials.length > 0 && (
        <TestimonialsSection testimonials={testimonials} />
      )}
      <BlogSection posts={latestPosts} />
      <Container className="py-16">
        <LocalCitiesGrid />
      </Container>
      <Container className="py-16">
        <FaqSection
          items={EV_FAQ_ITEMS.slice(0, 4)}
          subtitle="Află rapid costuri, timpi de încărcare și diferența între stațiile AC și DC."
        />
      </Container>
      <ContactCTA contact={contact} />
    </>
  );
}
