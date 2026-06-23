"use client";

import { useState, useTransition } from "react";
import { Download, FileText, Printer } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ToolResultPanel } from "@/components/tools/ToolResultPanel";
import { getQuoteAction } from "@/lib/actions/tools.actions";
import Link from "next/link";

export function PdfOfferGenerator() {
  const [quoteId, setQuoteId] = useState("");
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleLookup() {
    if (!quoteId.trim()) {
      setError("Introdu ID-ul ofertei");
      return;
    }
    startTransition(async () => {
      const result = await getQuoteAction(quoteId.trim());
      if (result.success) {
        setReference(result.quote.reference);
        setError("");
      } else {
        setReference(null);
        setError("Oferta nu a fost găsită. Generează mai întâi o ofertă.");
      }
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card padding="lg" className="space-y-5">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-brand-600" />
          <div>
            <h3 className="font-bold text-surface-900">Descarcă oferta generată</h3>
            <p className="text-sm text-surface-500">
              Introdu ID-ul primit după generarea cererii de ofertă.
            </p>
          </div>
        </div>
        <Input
          label="ID ofertă"
          placeholder="quote_1718456789012"
          value={quoteId}
          onChange={(e) => setQuoteId(e.target.value)}
          error={error}
        />
        <Button onClick={handleLookup} disabled={pending} className="w-full">
          {pending ? "Se caută..." : "Caută oferta"}
        </Button>
      </Card>

      {reference && (
        <ToolResultPanel title={`Ofertă ${reference}`} variant="success">
          <p className="mb-4 text-sm text-surface-600">
            Documentul HTML poate fi salvat ca PDF din browser (Ctrl+P → Salvează ca PDF).
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={`/api/tools/offer/${quoteId.trim()}`} download>
              <Button><Download className="h-4 w-4" /> Descarcă HTML</Button>
            </a>
            <a href={`/api/tools/offer/${quoteId.trim()}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline"><Printer className="h-4 w-4" /> Deschide pentru print</Button>
            </a>
          </div>
        </ToolResultPanel>
      )}

      <Card padding="md" className="text-center text-sm text-surface-500">
        Nu ai încă o ofertă?{" "}
        <Link href="/tools/generator-oferta" className="font-medium text-brand-600 hover:underline">
          Generează cerere ofertă
        </Link>
      </Card>
    </div>
  );
}
