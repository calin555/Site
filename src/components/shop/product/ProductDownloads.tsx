import { Download, FileText, BookOpen, Award, FileImage } from "lucide-react";
import type { ProductDocument } from "@/types/product";

interface ProductDownloadsProps {
  documents: ProductDocument[];
  productName: string;
}

const TYPE_CONFIG = {
  datasheet: { icon: FileText, label: "Fișă tehnică", color: "text-brand-600 bg-brand-50" },
  manual: { icon: BookOpen, label: "Manual", color: "text-blue-600 bg-blue-50" },
  certificate: { icon: Award, label: "Certificat", color: "text-amber-600 bg-amber-50" },
  brochure: { icon: FileImage, label: "Broșură", color: "text-purple-600 bg-purple-50" },
};

export function ProductDownloads({ documents, productName }: ProductDownloadsProps) {
  if (documents.length === 0) {
    return (
      <p className="text-sm text-surface-500">
        Nu există documente disponibile pentru acest produs.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-surface-500">
        Descarcă documentația tehnică pentru {productName}.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {documents.map((doc) => {
          const config = TYPE_CONFIG[doc.type];
          const Icon = config.icon;

          return (
            <a
              key={doc.id}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-2xl border border-surface-200 bg-white p-5 transition-all hover:border-brand-200 hover:shadow-md hover:shadow-brand-500/5"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${config.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-surface-900 group-hover:text-brand-700">
                  {doc.title}
                </p>
                {doc.description && (
                  <p className="mt-0.5 text-sm text-surface-500">{doc.description}</p>
                )}
                <div className="mt-2 flex items-center gap-2 text-xs font-medium text-brand-600">
                  <Download className="h-3.5 w-3.5" />
                  Descarcă PDF
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
