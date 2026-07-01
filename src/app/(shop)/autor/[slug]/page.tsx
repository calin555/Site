import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { BlogCard } from "@/components/shop/BlogCard";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { defaultAuthor } from "@/config/author";
import { siteConfig } from "@/config/site";
import { getAllArticles } from "@/lib/services/blog.service";
import { toLegacyPost } from "@/types/blog";

const AUTHORS = {
  [defaultAuthor.slug]: defaultAuthor,
} as const;

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(AUTHORS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = AUTHORS[slug as keyof typeof AUTHORS];
  if (!author) return { title: "Autor negăsit" };

  return buildPageMetadata({
    title: `${author.name} — autor ChargePro`,
    description: author.bio,
    path: `/autor/${slug}`,
    keywords: [author.name, "expert EV", "stații încărcare România"],
  });
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = AUTHORS[slug as keyof typeof AUTHORS];
  if (!author) notFound();

  const articles = getAllArticles()
    .filter(
      (a) =>
        a.author === author.name ||
        (!a.author && author.slug === defaultAuthor.slug)
    )
    .slice(0, 12);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    url: `${siteConfig.url}/autor/${slug}`,
    worksFor: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <JsonLd data={personSchema} />
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: author.name, path: `/autor/${slug}` },
        ]}
      />

      <PageHeader title={author.name} description={author.role} />

      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            { label: author.name },
          ]}
          className="mb-8"
        />

        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-surface-600">{author.bio}</p>
          <p className="mt-4 text-sm text-surface-500">
            <Link href="/despre" className="font-semibold text-brand-600 hover:text-brand-700">
              Despre ChargePro / IncarcareAuto.ro
            </Link>
            {" · "}
            <Link href="/contact" className="font-semibold text-brand-600 hover:text-brand-700">
              Contact consultanță
            </Link>
          </p>
        </div>

        {articles.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-surface-900">
              Articole publicate
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((post) => (
                <BlogCard key={post.id} post={toLegacyPost(post)} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
