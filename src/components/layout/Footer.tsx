import Link from "next/link";
import { Zap, Phone, Mail, MapPin, Facebook, Linkedin, Instagram } from "lucide-react";
import { siteConfig } from "@/config/site";
import { legalPaths } from "@/config/legal";
import { Container } from "@/components/shared/Container";
import { phoneToTel, type SiteContactSettings } from "@/types/site-contact";

interface FooterProps {
  contact: SiteContactSettings;
}

export function Footer({ contact }: FooterProps) {
  return (
    <footer className="gradient-dark relative min-w-0 overflow-x-hidden text-surface-300">
      {/* Signature gradient hairline with flowing current */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1 w-full"
        viewBox="0 0 1200 4"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          className="energy-flow-slow"
          d="M0 2 H1200"
          stroke="#a3e635"
          strokeWidth="1.5"
          strokeOpacity="0.7"
        />
      </svg>
      <div className="aurora-blob pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="aurora-blob-c pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-violet-500/8 blur-3xl" />
      <Container className="relative py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand ring-highlight transition-shadow duration-300 group-hover:shadow-glow-brand">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-surface-400">
              {siteConfig.description}
            </p>
            <div className="flex gap-3">
              {[Facebook, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-surface-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/50 hover:bg-brand-600 hover:text-white"
                  aria-label="Social media"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Magazin
            </h3>
            <ul className="space-y-2.5">
              {siteConfig.footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-brand-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Companie
            </h3>
            <ul className="space-y-2.5">
              {siteConfig.footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-brand-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {contact.sectionTitle}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <div>
                  <p className="text-white">{contact.phoneOrdersLabel}</p>
                  <a
                    href={`tel:${phoneToTel(contact.phoneOrders)}`}
                    className="hover:text-brand-400"
                  >
                    {contact.phoneOrders}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <div>
                  <p className="text-white">{contact.phoneTechnicalLabel}</p>
                  <a
                    href={`tel:${phoneToTel(contact.phoneTechnical)}`}
                    className="hover:text-brand-400"
                  >
                    {contact.phoneTechnical}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-brand-400" />
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-brand-400"
                >
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <MapPin className="h-4 w-4 shrink-0 text-brand-400" />
                {contact.address}
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-surface-800">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-surface-500">
            © {new Date().getFullYear()} {siteConfig.name}. Toate drepturile
            rezervate.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-surface-500">
            <Link href={legalPaths.terms} className="hover:text-brand-400">
              Termeni și condiții
            </Link>
            <Link href={legalPaths.privacy} className="hover:text-brand-400">
              Politica de confidențialitate
            </Link>
            <Link href={legalPaths.gdpr} className="hover:text-brand-400">
              Informare GDPR
            </Link>
            <a
              href="https://anpc.ro/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-400"
            >
              ANPC
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
