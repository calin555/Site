import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { COMPLETED_PROJECTS } from "@/lib/content/projects";
import { ProjectCard } from "@/components/content/ProjectCard";

export const metadata: Metadata = buildPageMetadata({
  title: "Proiecte realizate — stații încărcare EV România",
  description:
    "Proiecte reale ChargePro: wallbox acasă, firme, hoteluri, blocuri. Locație, echipament, provocări și rezultate măsurabile.",
  path: "/proiecte-realizate",
  keywords: ["proiecte stații încărcare", "instalări EV România", "wallbox montaj"],
});

export default function ProiecteRealizatePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", path: "/" },
          { name: "Proiecte realizate", path: "/proiecte-realizate" },
        ]}
      />
      <PageHeader
        title="Proiecte realizate"
        description="Instalări reale în România — rezidențial, business, hotel și condominiu. Fiecare proiect include echipament, durată, provocări și rezultat."
      />
      <Container className="py-8">
        <Breadcrumbs
          items={[{ label: "Proiecte realizate" }]}
          className="mb-8"
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {COMPLETED_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-brand-50 p-8 text-center">
          <h2 className="text-xl font-bold text-surface-900">
            Ai un proiect similar?
          </h2>
          <p className="mt-2 text-surface-600">
            Consultanță gratuită și ofertă în 24h lucrătoare.
          </p>
          <Link
            href="/contact"
            className="gradient-brand ring-highlight btn-ripple mt-4 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-elev-1 transition-all duration-300 hover:shadow-glow-brand"
          >
            Solicită evaluare
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </>
  );
}
