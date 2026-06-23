import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BlogCard } from "@/components/shop/BlogCard";
import {
  getBlogTagBySlug,
  getArticlesByTag,
} from "@/lib/services/blog.service";
import { toLegacyPost } from "@/types/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = getBlogTagBySlug(slug);
  if (!tag) return { title: "Tag negăsit" };
  return {
    title: `#${tag.name} — Blog`,
    description: `Articole despre ${tag.name}`,
  };
}

export default async function BlogTagPage({ params }: Props) {
  const { slug } = await params;
  const tag = getBlogTagBySlug(slug);
  if (!tag) notFound();

  const posts = getArticlesByTag(slug);

  return (
    <>
      <PageHeader
        title={`#${tag.name}`}
        description={`Articole etichetate cu „${tag.name}"`}
      />
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            { label: `#${tag.name}` },
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
            Niciun articol cu acest tag.
          </p>
        )}
      </Container>
    </>
  );
}
