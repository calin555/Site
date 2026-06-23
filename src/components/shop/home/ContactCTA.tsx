import Link from "next/link";
import { ArrowRight, Phone, Mail, MessageCircle } from "lucide-react";
import { AnimateIn } from "@/components/shared/AnimateIn";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/Button";
import { phoneToTel, type SiteContactSettings } from "@/types/site-contact";

interface ContactCTAProps {
  contact: SiteContactSettings;
}

export function ContactCTA({ contact }: ContactCTAProps) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div className="gradient-brand absolute inset-0" />
      <div className="absolute inset-0 pattern-dots opacity-20" />
      <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <AnimateIn direction="fade">
            <div>
              <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
                Consultanță gratuită
              </span>
              <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl lg:text-5xl text-balance">
                Pregătit să treci la electric?
              </h2>
              <p className="mt-4 max-w-lg text-lg text-brand-100">
                Spune-ne despre vehiculul tău și spațiul de instalare. Îți
                recomandăm stația potrivită în maxim 24 de ore — fără costuri.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="w-full bg-white text-brand-700 shadow-lg hover:bg-brand-50 sm:w-auto"
                  >
                    Solicită ofertă gratuită
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a
                  href={`tel:${phoneToTel(contact.phoneOrders)}`}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white sm:w-auto"
                  >
                    <Phone className="h-4 w-4" />
                    {contact.phoneOrders}
                  </Button>
                </a>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={200}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                {
                  icon: Phone,
                  title: contact.phoneOrdersLabel,
                  value: contact.phoneOrders,
                  href: `tel:${phoneToTel(contact.phoneOrders)}`,
                },
                {
                  icon: MessageCircle,
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
              ].map(({ icon: Icon, title, value, href }) => (
                <a
                  key={title}
                  href={href}
                  className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/15"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white transition-colors group-hover:bg-white group-hover:text-brand-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-brand-200">
                      {title}
                    </p>
                    <p className="font-semibold text-white">{value}</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-white/50 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                </a>
              ))}

              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <p className="text-xs font-medium text-brand-200">Program</p>
                <p className="mt-1 font-semibold text-white">
                  {contact.hours}
                </p>
                <p className="mt-2 text-sm text-brand-100">
                  Răspundem în aceeași zi lucrătoare
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </Container>
    </section>
  );
}
