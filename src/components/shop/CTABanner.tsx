import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/shared/Container";

interface CTABannerProps {
  title?: string;
  description?: string;
}

export function CTABanner({
  title = "Ai nevoie de ajutor să alegi stația potrivită?",
  description = "Echipa noastră tehnică îți oferă consultanță gratuită. Spune-ne despre vehiculul tău și spațiul de instalare.",
}: CTABannerProps) {
  return (
    <section className="gradient-brand relative overflow-hidden">
      <div className="absolute inset-0 pattern-dots opacity-30" />
      <Container className="relative py-16 text-center sm:py-20">
        <h2 className="text-3xl font-bold text-white sm:text-4xl text-balance">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-brand-100 sm:text-lg">
          {description}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/contact">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-brand-700 hover:bg-brand-50"
            >
              Contactează-ne
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/produse">
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              Vezi catalogul
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
