import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { getAllCityPages } from "@/lib/seo/local/city-pages";

interface LocalCitiesGridProps {
  title?: string;
  excludeSlug?: string;
  compact?: boolean;
}

export function LocalCitiesGrid({
  title = "Stații de încărcare EV în România",
  excludeSlug,
  compact = false,
}: LocalCitiesGridProps) {
  const cities = getAllCityPages().filter((c) => c.slug !== excludeSlug);

  return (
    <section id="local-cities">
      <h2 className="text-2xl font-bold text-surface-900">{title}</h2>
      <p className="mt-2 max-w-2xl text-surface-600">
        Instalare, consultanță și livrare stații wallbox AC și încărcătoare rapide DC
        în principalele orașe din țară.
      </p>
      <div
        className={
          compact
            ? "mt-6 flex flex-wrap gap-2"
            : "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        }
      >
        {cities.map((city) =>
          compact ? (
            <Link
              key={city.slug}
              href={`/${city.slug}`}
              className="rounded-full border border-surface-200 bg-white px-4 py-2 text-sm font-medium text-surface-700 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              {city.cityName}
            </Link>
          ) : (
            <Link key={city.slug} href={`/${city.slug}`}>
              <Card
                padding="md"
                className="h-full transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900">
                      {city.cityName}
                    </p>
                    <p className="text-xs text-surface-500">{city.county}</p>
                  </div>
                </div>
              </Card>
            </Link>
          )
        )}
      </div>
    </section>
  );
}
