import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Card } from "@/components/ui/Card";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { CASE_STUDIES, getCaseStudyBySlug } from "@/lib/content/case-studies";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CASE_STUDIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return { title: "Studiu negăsit" };
  return buildPageMetadata({
    title: `${study.title} — studiu de caz ChargePro`,
    description: study.summary,
    path: `/studii-de-caz/${slug}`,
    keywords: [study.segment, "stație încărcare", study.location],
  });
}

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", path: "/" },
          { name: "Studii de caz", path: "/studii-de-caz" },
          { name: study.title, path: `/studii-de-caz/${slug}` },
        ]}
      />
      <PageHeader title={study.title} description={study.summary} />
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: "Studii de caz", href: "/studii-de-caz" },
            { label: study.title },
          ]}
          className="mb-8"
        />

        <div className="grid gap-10 lg:grid-cols-3">
          <article className="blog-content lg:col-span-2">
            <h2>Context client</h2>
            <p>{study.clientProfile}</p>

            <h2>Problema</h2>
            <p>{study.problem}</p>

            <h2>Soluția implementată</h2>
            <p>{study.solution}</p>
            <p>
              <strong>Echipament:</strong> {study.equipment}
            </p>
            <p>
              <strong>Timeline:</strong> {study.timeline}
            </p>

            <h2>Provocări</h2>
            <ul>
              {study.challenges.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>

            <h2>Lecții învățate</h2>
            <ul>
              {study.lessons.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </article>

          <aside className="space-y-6">
            <Card padding="lg">
              <h3 className="font-bold text-surface-900">Rezultate</h3>
              <dl className="mt-4 space-y-3">
                {study.metrics.map((m) => (
                  <div key={m.label}>
                    <dt className="text-xs text-surface-500">{m.label}</dt>
                    <dd className="text-xl font-bold text-brand-700">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            <Card padding="md">
              <h3 className="font-semibold text-surface-900">Instrumente</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {study.relatedTools.map((t) => (
                  <li key={t.href}>
                    <Link href={t.href} className="text-brand-600 hover:underline">
                      {t.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>

            <Link
              href={study.relatedLanding}
              className="gradient-brand ring-highlight btn-ripple inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-elev-1 transition-all duration-300 hover:shadow-glow-brand"
            >
              Soluție similară
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </Container>
    </>
  );
}
