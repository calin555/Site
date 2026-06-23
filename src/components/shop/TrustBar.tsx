import { Shield, Truck, Wrench, Award } from "lucide-react";
import { Container } from "@/components/shared/Container";

const features = [
  {
    icon: Shield,
    title: "Garanție extinsă",
    description: "Până la 5 ani garanție pe stațiile ChargePro.",
  },
  {
    icon: Wrench,
    title: "Instalare profesională",
    description: "Echipă autorizată ANRE pentru montaj sigur.",
  },
  {
    icon: Truck,
    title: "Livrare rapidă",
    description: "Expediere în 24–48h pentru produsele din stoc.",
  },
  {
    icon: Award,
    title: "Calitate certificată",
    description: "Produse conforme CE, testate pentru climat RO.",
  },
];

export function TrustBar() {
  return (
    <section className="border-y border-surface-200 bg-surface-50">
      <Container className="py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-surface-900">{title}</h3>
                <p className="mt-1 text-sm text-surface-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
