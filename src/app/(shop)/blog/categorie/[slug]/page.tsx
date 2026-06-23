import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BlogCard } from "@/components/shop/BlogCard";
import {
  getBlogCategoryBySlug,
  getArticlesByCategory,
} from "@/lib/services/blog.service";
import { toLegacyPost } from "@/types/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getBlogCategoryBySlug(slug);
  if (!category) return { title: "Categorie negăsită" };
  return {
    title: `${category.name} — Blog`,
    description: category.description,
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getBlogCategoryBySlug(slug);
  if (!category) notFound();

  const posts = getArticlesByCategory(slug);

  return (
    <>
      <PageHeader
        title={category.name}
        description={category.description}
      />
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            { label: category.name },
          ]}
          className="mb-8"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={toLegacyPost(post)} />
          ))}
        </div>
        {posts.length === 0 && (
          <p className="text-center text-surface-500">
            Niciun articol în această categorie.
          </p>
        )}
      </Container>
    </>
  );
}
