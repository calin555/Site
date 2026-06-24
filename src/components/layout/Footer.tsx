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
    <footer className="gradient-dark text-surface-300">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
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
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-800 text-surface-400 transition-colors hover:bg-brand-600 hover:text-white"
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
