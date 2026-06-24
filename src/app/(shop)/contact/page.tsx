import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { ContactForm } from "@/components/shop/contact/ContactForm";
import { getSiteContactSettings } from "@/lib/services/site-contact.service";
import { phoneToTel } from "@/types/site-contact";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact — consultanță stații încărcare EV",
  description:
    "Contactează echipa noastră pentru oferte stații încărcare mașini electrice, instalare ANRE și suport tehnic încărcătoare EV în România.",
  path: "/contact",
});

interface ContactPageProps {
  searchParams: Promise<{ oferta?: string; produs?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const contact = await getSiteContactSettings();
  const params = await searchParams;
  const defaultSubject = params.produs
    ? `Solicitare ofertă: ${params.produs}`
    : "";

  const contactMethods = [
    {
      icon: Phone,
      title: contact.phoneOrdersLabel,
      value: contact.phoneOrders,
      href: `tel:${phoneToTel(contact.phoneOrders)}`,
    },
    {
      icon: Phone,
      title: contact.phoneTechnicalLabel,
      value: contact.phoneTechnical,
      href: `tel:${phoneToTel(contact.phoneTechnical)}`,
    },
    {
      icon: Mail,
      title: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: Clock,
      title: "Program",
      value: contact.hours,
    },
    {
      icon: MapPin,
      title: "Adresă",
      value: contact.address,
    },
  ];

  return (
    <>
      <PageHeader
        title="Contact"
        description="Suntem aici să te ajutăm. Scrie-ne sau sună-ne pentru consultanță gratuită."
      />
      <Container className="py-8">
        <Breadcrumbs items={[{ label: "Contact" }]} className="mb-8" />

        <div className="grid gap-10 lg:grid-cols-5">
          {/* Contact info */}
          <div className="space-y-4 lg:col-span-2">
            {contactMethods.map(({ icon: Icon, title, value, href }) => (
              <Card key={title} padding="md" className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-500">{title}</p>
                  {href ? (
                    <a
                      href={href}
                      className="font-semibold text-surface-900 hover:text-brand-600"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="font-semibold text-surface-900">{value}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Contact form */}
          <Card padding="lg" className="lg:col-span-3">
            <div className="mb-6 flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-brand-600" />
              <h2 className="text-xl font-bold text-surface-900">
                Trimite-ne un mesaj
              </h2>
            </div>
            <ContactForm defaultSubject={defaultSubject} />
          </Card>
        </div>
      </Container>
    </>
  );
}
