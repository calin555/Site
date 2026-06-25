import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHeader } from "@/components/shared/PageHeader";
import type { LegalSection } from "@/lib/legal/content";

interface LegalDocumentProps {
  title: string;
  description: string;
  updatedAt: string;
  sections: LegalSection[];
}

export function LegalDocument({
  title,
  description,
  updatedAt,
  sections,
}: LegalDocumentProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <Container className="py-10 sm:py-14">
        <Breadcrumbs
          items={[{ label: title }]}
          className="mb-8"
        />
        <p className="mb-8 text-sm text-surface-500">
          Ultima actualizare: {updatedAt}
        </p>
        <article className="min-w-0 max-w-3xl break-anywhere">
          {sections.map((section) => (
            <section key={section.title} className="mb-10">
              <h2 className="text-xl font-bold text-surface-900">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="mt-3 text-base leading-relaxed text-surface-600"
                  dangerouslySetInnerHTML={{ __html: paragraph }}
                />
              ))}
              {section.list ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-surface-600">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </article>
      </Container>
    </>
  );
}
