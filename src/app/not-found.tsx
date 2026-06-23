import Link from "next/link";
import { Home } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-8xl font-bold text-brand-200">404</p>
      <h1 className="mt-4 text-2xl font-bold text-surface-900">
        Pagina nu a fost găsită
      </h1>
      <p className="mt-2 max-w-md text-surface-500">
        Ne pare rău, pagina pe care o cauți nu există sau a fost mutată.
      </p>
      <Link href="/" className="mt-8">
        <Button>
          <Home className="h-4 w-4" />
          Înapoi acasă
        </Button>
      </Link>
    </Container>
  );
}
