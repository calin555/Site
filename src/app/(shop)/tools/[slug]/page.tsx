import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { TOOL_BY_SLUG, TOOLS } from "@/config/tools";
import { renderTool } from "@/components/tools/tool-registry";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOL_BY_SLUG[slug];
  if (!tool) return { title: "Instrument negăsit" };
  return {
    title: tool.title,
    description: tool.description,
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = TOOL_BY_SLUG[slug];
  const toolContent = await renderTool(slug);

  if (!tool || !toolContent) notFound();

  return (
    <>
      <PageHeader title={tool.title} description={tool.description} />
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: "Instrumente", href: "/tools" },
            { label: tool.shortTitle },
          ]}
          className="mb-8"
        />
        {toolContent}
      </Container>
    </>
  );
}
