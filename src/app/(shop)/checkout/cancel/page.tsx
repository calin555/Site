import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Plată anulată",
  description: "Plata nu a fost finalizată.",
};

interface CancelPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutCancelPage({
  searchParams,
}: CancelPageProps) {
  const params = await searchParams;
  const orderNumber = params.order;
  return (
    <>
      <PageHeader title="Plată anulată" />
      <Container className="py-12">
        <Card padding="lg" className="mx-auto max-w-lg text-center">
          <XCircle className="mx-auto h-16 w-16 text-surface-400" />
          <h2 className="mt-4 text-2xl font-bold text-surface-900">
            Plata nu a fost finalizată
          </h2>
          <p className="mt-2 text-surface-500">
            Comanda ta nu a fost procesată. Poți reîncerca oricând.
          </p>
          {orderNumber && (
            <p className="mt-4 text-sm text-surface-400">
              Referință comandă: {orderNumber}
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/checkout">
              <Button>Înapoi la checkout</Button>
            </Link>
            <Link href="/cos">
              <Button variant="outline">Vezi coșul</Button>
            </Link>
          </div>
        </Card>
      </Container>
    </>
  );
}
