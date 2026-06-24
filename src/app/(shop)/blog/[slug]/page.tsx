import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { BlogContent } from "@/components/blog/BlogContent";
import { BlogTags } from "@/components/blog/BlogTags";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import {
  getArticleBySlug,
  getRelatedArticles,
  generateStaticArticleParams,
} from "@/lib/services/blog.service";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqSection } from "@/components/seo/FaqSection";
import {
  buildArticleJsonLd,
  buildArticleMetadata,
} from "@/lib/blog/seo";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getArticleBySlug(slug);
  if (!post) return { title: "Articol negăsit" };
  return buildArticleMetadata(post);
}

export function generateStaticParams() {
  return generateStaticArticleParams();
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = getArticleBySlug(slug);
  if (!post) notFound();

  const related = getRelatedArticles(post);
  const jsonLd = buildArticleJsonLd(post);

  const date = new Date(post.publishedAt).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            {
              label: post.category.name,
              href: `/blog/categorie/${post.category.slug}`,
            },
            { label: post.title },
          ]}
          className="mb-8"
        />

        <article className="mx-auto max-w-3xl">
          <Link
            href={`/blog/categorie/${post.category.slug}`}
            className="mb-4 inline-block"
          >
            <Badge variant="brand">{post.category.name}</Badge>
          </Link>
          <h1 className="text-3xl font-bold text-surface-900 sm:text-4xl text-balance">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-surface-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime} min citire
            </span>
            <span>de {post.author}</span>
          </div>

          <div className="mt-4">
            <BlogTags tags={post.tags} />
          </div>

          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <p className="mt-8 text-lg leading-relaxed text-surface-600">
            {post.excerpt}
          </p>

          <BlogContent html={post.content} className="mt-6" />

          {post.faq?.length ? (
            <div className="mt-12">
              <FaqSection
                title="Întrebări frecvente"
                subtitle=""
                items={post.faq}
              />
            </div>
          ) : null}

          <RelatedArticles articles={related} />

          <Link
            href="/blog"
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Înapoi la blog
          </Link>
        </article>
      </Container>
    </>
  );
}
