import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BlogCard } from "@/components/shop/BlogCard";
import { BlogCategoryFilter } from "@/components/blog/BlogCategoryFilter";
import { getPublishedArticles, getBlogCategories } from "@/lib/services/blog.service";
import { toLegacyPost } from "@/types/blog";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog — ghiduri încărcare vehicule electrice",
  description:
    "Articole despre stații încărcare EV, cost încărcare, conectori, finanțări AFM și infrastructură de reîncărcare electrică în România.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getPublishedArticles();
  const categories = getBlogCategories();

  return (
    <>
      <PageHeader
        title="Blog"
        description="Ghiduri practice, noutăți din industrie și sfaturi tehnice pentru mobilitate electrică."
      />
      <Container className="py-8">
        <Breadcrumbs items={[{ label: "Blog" }]} className="mb-8" />

        <Suspense>
          <BlogCategoryFilter categories={categories} />
        </Suspense>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={toLegacyPost(post)} />
          ))}
        </div>
      </Container>
    </>
  );
}
