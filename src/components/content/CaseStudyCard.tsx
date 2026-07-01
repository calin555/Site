import Link from "next/link";
import { ArrowRight, Building2, Home, Hotel } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { CaseStudy, CaseStudySegment } from "@/lib/content/case-studies";

const SEGMENT_ICON: Record<CaseStudySegment, typeof Building2> = {
  firma: Building2,
  hotel: Hotel,
  bloc: Home,
};

const SEGMENT_LABEL: Record<CaseStudySegment, string> = {
  firma: "Firmă",
  hotel: "Hotel",
  bloc: "Bloc / condominiu",
};

interface CaseStudyCardProps {
  study: CaseStudy;
}

export function CaseStudyCard({ study }: CaseStudyCardProps) {
  const Icon = SEGMENT_ICON[study.segment];

  return (
    <Card padding="lg" className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-2 text-brand-600">
        <Icon className="h-5 w-5" />
        <span className="text-xs font-semibold uppercase tracking-wide">
          {SEGMENT_LABEL[study.segment]}
        </span>
      </div>
      <h3 className="text-lg font-bold text-surface-900">{study.title}</h3>
      <p className="mt-1 text-sm text-surface-500">{study.location}</p>
      <p className="mt-3 flex-1 text-sm text-surface-600">{study.summary}</p>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-surface-100 pt-4">
        {study.metrics.slice(0, 3).map((m) => (
          <div key={m.label} className="text-center">
            <p className="text-lg font-bold text-brand-700">{m.value}</p>
            <p className="text-xs text-surface-500">{m.label}</p>
          </div>
        ))}
      </div>
      <Link
        href={`/studii-de-caz/${study.slug}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
      >
        Citește studiul de caz
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Card>
  );
}
