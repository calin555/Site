import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TOOLS } from "@/config/tools";
import { cn } from "@/lib/utils";

interface ToolsGridProps {
  featuredOnly?: boolean;
}

const categoryLabels = {
  calculator: "Calculator",
  generator: "Generator",
  marketplace: "Marketplace",
};

export function ToolsGrid({ featuredOnly = false }: ToolsGridProps) {
  const tools = featuredOnly ? TOOLS.filter((t) => t.featured) : TOOLS;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <Link key={tool.slug} href={`/tools/${tool.slug}`}>
            <Card hover padding="lg" className="group h-full">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="text-xs">
                  {categoryLabels[tool.category]}
                </Badge>
              </div>
              <CardTitle className="mb-2 group-hover:text-brand-700">
                {tool.shortTitle}
              </CardTitle>
              <p className="mb-4 text-sm text-surface-500 line-clamp-3">
                {tool.description}
              </p>
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-sm font-semibold text-brand-600",
                  "opacity-0 transition-opacity group-hover:opacity-100"
                )}
              >
                Deschide <ArrowRight className="h-4 w-4" />
              </span>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
