import type { Metadata } from "next";
import Image from "next/image";
import { Award, Users, Zap, Target } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CTABanner } from "@/components/shop/CTABanner";
import { Card } from "@/components/ui/Card";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Despre noi — infrastructură încărcare electrică România",
  description:
    "ChargePro / IncarcAuto.ro — partenerul tău pentru stații încărcare EV, rețele de încărcare electrică și soluții AC/DC pentru acasă, afaceri și flote.",
  path: "/despre",
});

const values = [
  {
    icon: Zap,
    title: "Inovație",
    description:
      "Adoptăm cele mai noi tehnologii OCPP, load balancing și management cloud.",
  },
  {
    icon: Award,
    title: "Calitate",
    description:
      "Produse certificate CE, testate pentru condiții climatice din România.",
  },
  {
    icon: Users,
    title: "Suport dedicat",
    description:
      "Echipă tehnică română, disponibilă pentru consultanță și instalare.",
  },
  {
    icon: Target,
    title: "Soluții complete",
    description:
      "De la stație individuală la infrastructură de flotă — un singur partener.",
  },
];

const stats = [
  { value: "2.500+", label: "Stații instalate" },
  { value: "8+", label: "Ani experiență" },
  { value: "98%", label: "Clienți mulțumiți" },
  { value: "24h", label: "Timp răspuns tehnic" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Despre ChargePro"
        description="Construim infrastructura de încărcare electrică pentru România — de la prima stație de acasă la rețele comerciale complete."
        dark
      />

      <Container className="py-8">
        <Breadcrumbs items={[{ label: "Despre noi" }]} className="mb-12" />

        {/* Story */}
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <SectionHeading
              badge="Povestea noastră"
              title="Energie curată, livrată cu expertiză"
              subtitle="Din 2018, ChargePro este partenerul de încredere pentru proprietari de vehicule electrice, companii și administratori de flote din România."
            />
            <p className="text-surface-600 leading-relaxed">
              Am pornit cu o misiune simplă: să facem tranziția către mobilitatea
              electrică accesibilă și fără griji. Astăzi, oferim o gamă completă
              de stații AC și DC, accesorii profesionale și servicii de instalare
              autorizată ANRE.
            </p>
            <p className="text-surface-600 leading-relaxed">
              Fiecare proiect — de la un wallbox de 7.4 kW montat în garaj, până
              la o rețea de 20 stații DC pentru o flotă logistică — primește
              aceeași atenție la detalii și suport post-vânzare.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&h=600&fit=crop"
              alt="Stație de încărcare vehicule electrice — echipă ChargePro România"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-surface-200 bg-surface-50 p-6 text-center"
            >
              <p className="text-3xl font-bold text-brand-600">{value}</p>
              <p className="mt-1 text-sm text-surface-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mt-20">
          <SectionHeading
            badge="Valori"
            title="Ce ne definește"
            align="center"
            className="mb-12"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }) => (
              <Card key={title} hover padding="lg" className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-surface-900">{title}</h3>
                <p className="mt-2 text-sm text-surface-500">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </Container>

      <CTABanner />
    </>
  );
}
