"use client";

import { useRef, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PdfCatalogImportProps {
  productName: string;
  onImported: (data: {
    description: string;
    shortDescription: string;
    catalogPdfUrl: string;
  }) => void;
}

export function PdfCatalogImport({
  productName,
  onImported,
}: PdfCatalogImportProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState("");
  const [catalogPdfUrl, setCatalogPdfUrl] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (productName.trim()) {
        formData.append("productName", productName.trim());
      }

      const res = await fetch("/api/admin/import-product-pdf", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const payload = await res.json();
      if (!res.ok) {
        setMessage(payload.error ?? "Import PDF eșuat");
        return;
      }

      const data = payload.data;
      setCatalogPdfUrl(data.catalogPdfUrl);
      onImported({
        description: data.description,
        shortDescription: data.shortDescription,
        catalogPdfUrl: data.catalogPdfUrl,
      });

      setMessage(
        data.warning
          ? `${data.warning} Descrierea a fost tradusă în română.`
          : "Catalog importat. Descrierea a fost extrasă și tradusă în română."
      );
    } catch {
      setMessage("Eroare la importul PDF. Încearcă din nou.");
    } finally {
      setImporting(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-xl border border-surface-200 bg-white p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-surface-800">
            Catalog PDF (opțional)
          </p>
          <p className="mt-1 text-xs text-surface-500">
            Încarcă catalogul în engleză — extragem textul relevant, îl traducem
            automat în română și îl atașăm la produs.
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={importing}
          onClick={() => inputRef.current?.click()}
        >
          {importing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          {importing ? "Se procesează..." : "Încarcă PDF"}
        </Button>
      </div>

      {catalogPdfUrl && (
        <p className="mb-2 text-xs text-brand-700">
          PDF atașat:{" "}
          <a
            href={catalogPdfUrl}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Vezi catalogul
          </a>
        </p>
      )}

      {message && (
        <p
          className={`text-xs ${
            message.includes("tradus") || message.includes("importat")
              ? "text-brand-700"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
