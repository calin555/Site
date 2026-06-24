"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Link2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ProductImagesField } from "@/components/admin/ProductImagesField";
import type { CatalogProduct } from "@/types/catalog";
import type { StockStatus } from "@/lib/catalog/stock-status";
import { STOCK_STATUS_OPTIONS } from "@/lib/catalog/stock-status";
import type { Category, Brand } from "@/lib/mock-data";
import { saveProductAction } from "@/lib/actions/admin/product.actions";
import { PdfCatalogImport } from "@/components/admin/PdfCatalogImport";
import { dedupeImageUrls } from "@/lib/product-images";

const CONNECTOR_OPTIONS = ["Type 2", "Type 1", "CCS2", "CHAdeMO", "Tesla"];

function initialProductImages(product?: CatalogProduct): string[] {
  if (product?.galleryImages?.length) {
    return dedupeImageUrls(product.galleryImages);
  }
  if (product?.image) return [product.image];
  return [];
}

interface ProductEditorFormProps {
  product?: CatalogProduct;
  categories: Category[];
  brands: Brand[];
}

export function ProductEditorForm({
  product,
  categories,
  brands,
}: ProductEditorFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [shortDescription, setShortDescription] = useState(
    product?.shortDescription ?? ""
  );
  const [description, setDescription] = useState(product?.description ?? "");
  const [images, setImages] = useState<string[]>(() => initialProductImages(product));
  const [categorySlug, setCategorySlug] = useState(
    product?.categorySlug ?? categories[0]?.slug ?? ""
  );
  const [powerKw, setPowerKw] = useState(
    product?.powerKw ? String(product.powerKw) : "7.4"
  );
  const [connectors, setConnectors] = useState<string[]>(
    product?.connectorTypes ?? ["Type 2"]
  );
  const [catalogPdfUrl, setCatalogPdfUrl] = useState(product?.catalogPdfUrl ?? "");
  const [stockStatus, setStockStatus] = useState<StockStatus>(
    product?.stockStatus ?? "IN_STOCK"
  );
  const [isPending, startTransition] = useTransition();

  function toggleConnector(c: string) {
    setConnectors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  async function handleImportFromUrl() {
    if (!importUrl.trim()) {
      setImportMessage("Introdu un link Alibaba sau alt site de produs.");
      return;
    }

    setImporting(true);
    setImportMessage("");
    setErrors({});

    try {
      const res = await fetch("/api/admin/import-product-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ url: importUrl.trim() }),
      });

      const payload = await res.json();
      if (!res.ok) {
        setImportMessage(payload.error ?? "Import eșuat");
        return;
      }

      const data = payload.data;
      if (data.name) setName(data.name);
      if (data.shortDescription) setShortDescription(data.shortDescription);
      if (data.description) setDescription(data.description);
      if (data.images?.length) {
        setImages(dedupeImageUrls(data.images));
      } else if (data.image) {
        setImages([data.image]);
      }
      if (data.suggestedCategorySlug) {
        setCategorySlug(data.suggestedCategorySlug);
      }
      if (data.suggestedPowerKw) {
        setPowerKw(String(data.suggestedPowerKw));
      }
      if (data.suggestedConnectors?.length) {
        setConnectors(data.suggestedConnectors);
      }

      setImportMessage(
        data.translationWarning
          ? `Import reușit, dar traducerea a eșuat: ${data.translationWarning}`
          : data.source === "alibaba"
            ? "Import reușit de pe Alibaba — text tradus automat în română. Verifică datele și completează prețul."
            : "Import reușit. Verifică datele și completează prețul înainte de salvare."
      );
    } catch {
      setImportMessage("Eroare la import. Încearcă din nou.");
    } finally {
      setImporting(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    setErrors({});
    startTransition(async () => {
      const result = await saveProductAction({
        id: product?.id,
        name,
        slug: slug || undefined,
        shortDescription,
        description: description || undefined,
        price: form.get("price"),
        compareAtPrice: form.get("compareAtPrice") || undefined,
        images,
        categorySlug,
        brandSlug: form.get("brandSlug"),
        powerKw,
        phases: form.get("phases"),
        connectorTypes: connectors,
        stock: form.get("stock"),
        stockStatus,
        isFeatured: form.get("isFeatured") === "on",
        isNew: form.get("isNew") === "on",
        catalogPdfUrl: catalogPdfUrl || undefined,
      });

      if (result.success) {
        router.push("/admin/produse");
        router.refresh();
      } else {
        setErrors(result.errors);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{errors.form}</p>
      )}

      <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-4">
        <p className="mb-2 text-sm font-medium text-surface-800">
          Import automat din link (opțional)
        </p>
        <p className="mb-3 text-xs text-surface-500">
          Lipește un link Alibaba (preferabil www.alibaba.com în engleză) — se
          completează automat titlul, descrierea tradusă în română, imaginile
          și câteva specificații.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
            placeholder="https://www.alibaba.com/product-detail/..."
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleImportFromUrl}
            disabled={importing}
          >
            {importing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Link2 className="h-4 w-4" />
            )}
            {importing ? "Se importă și traduce..." : "Importă de pe link"}
          </Button>
        </div>
        {importMessage && (
          <p
            className={`mt-3 text-xs ${
              importMessage.includes("reușit") ? "text-brand-700" : "text-red-600"
            }`}
          >
            {importMessage}
          </p>
        )}
      </div>

      <PdfCatalogImport
        productName={name}
        onImported={(data) => {
          setDescription(data.description);
          setShortDescription(data.shortDescription);
          setCatalogPdfUrl(data.catalogPdfUrl);
        }}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Nume produs"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
        />
        <Input
          label="Slug URL (opțional)"
          name="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          hint="Lăsat gol = generat automat din nume"
          error={errors.slug}
        />
      </div>

      <Textarea
        label="Descriere scurtă"
        name="shortDescription"
        value={shortDescription}
        onChange={(e) => setShortDescription(e.target.value)}
        rows={2}
        error={errors.shortDescription}
        required
      />

      <Textarea
        label="Descriere completă (opțional)"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={8}
        hint="Generată automat din catalog PDF și tradusă în română. Poți edita textul înainte de salvare."
      />

      <ProductImagesField
        images={images}
        onChange={setImages}
        productName={name}
        error={errors.images}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-800">Categorie</label>
          <select
            name="categorySlug"
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="h-11 w-full rounded-xl border border-surface-200 bg-white px-4 text-sm"
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-800">Brand</label>
          <select
            name="brandSlug"
            defaultValue={product?.brandSlug ?? brands[0]?.slug}
            className="h-11 w-full rounded-xl border border-surface-200 bg-white px-4 text-sm"
          >
            {brands.map((b) => (
              <option key={b.slug} value={b.slug}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Input
          label="Preț (RON)"
          name="price"
          type="number"
          min={0.01}
          step={0.01}
          placeholder="ex: 4500"
          defaultValue={product?.price}
          error={errors.price}
          required
        />
        <Input
          label="Preț vechi (opțional)"
          name="compareAtPrice"
          type="number"
          min={0.01}
          step={0.01}
          placeholder="ex: 5200"
          defaultValue={product?.compareAtPrice}
          error={errors.compareAtPrice}
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-700">
            Tip stoc
          </label>
          <select
            name="stockStatus"
            value={stockStatus}
            onChange={(e) => setStockStatus(e.target.value as StockStatus)}
            className="h-11 w-full rounded-xl border border-surface-200 bg-white px-4 text-sm"
          >
            {STOCK_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-surface-500">
            {STOCK_STATUS_OPTIONS.find((o) => o.value === stockStatus)?.hint}
          </p>
          {errors.stockStatus && (
            <p className="mt-1 text-xs text-red-600">{errors.stockStatus}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Input
          label={
            stockStatus === "IN_STOCK"
              ? "Cantitate în stoc"
              : "Cantitate estimată (opțional)"
          }
          name="stock"
          type="number"
          min={0}
          defaultValue={product?.stock ?? 0}
          error={errors.stock}
          required={stockStatus === "IN_STOCK"}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Putere (kW)"
          name="powerKw"
          type="number"
          min={0.1}
          step={0.1}
          placeholder="ex: 7.4"
          value={powerKw}
          onChange={(e) => setPowerKw(e.target.value)}
          error={errors.powerKw}
          required
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-800">Faze</label>
          <select
            name="phases"
            defaultValue={product?.phases ?? "SINGLE"}
            className="h-11 w-full rounded-xl border border-surface-200 bg-white px-4 text-sm"
          >
            <option value="SINGLE">Monofazat</option>
            <option value="THREE">Trifazat</option>
          </select>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-surface-800">Conectori</p>
        <div className="flex flex-wrap gap-2">
          {CONNECTOR_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleConnector(c)}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                connectors.includes(c)
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-surface-200 text-surface-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured} />
          Produs featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isNew" defaultChecked={product?.isNew} />
          Produs nou
        </label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {product ? "Salvează modificările" : "Adaugă produsul"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/produse")}>
          Anulează
        </Button>
      </div>
    </form>
  );
}
