import { Star, BadgeCheck } from "lucide-react";
import type { ProductReview } from "@/types/product";

interface ProductReviewsProps {
  reviews: ProductReview[];
  averageRating: number;
  reviewCount: number;
}

function StarRating({
  rating,
  size = "md",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" };

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass[size]} ${
            i < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-surface-200 text-surface-200"
          }`}
        />
      ))}
    </div>
  );
}

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-3 text-surface-500">{stars}</span>
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-100">
        <div
          className="h-full rounded-full bg-amber-400 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right text-xs text-surface-400">{count}</span>
    </div>
  );
}

export function ProductReviews({
  reviews,
  averageRating,
  reviewCount,
}: ProductReviewsProps) {
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }));

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      {/* Summary */}
      <div className="rounded-2xl border border-surface-200 bg-surface-50 p-6">
        <div className="text-center">
          <p className="text-5xl font-bold text-surface-900">{averageRating}</p>
          <StarRating rating={averageRating} size="lg" />
          <p className="mt-2 text-sm text-surface-500">
            {reviewCount} {reviewCount === 1 ? "recenzie" : "recenzii"}
          </p>
        </div>
        <div className="mt-6 space-y-2">
          {distribution.map(({ stars, count }) => (
            <RatingBar
              key={stars}
              stars={stars}
              count={count}
              total={reviewCount}
            />
          ))}
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-6 lg:col-span-2">
        {reviews.map((review) => {
          const date = new Date(review.date).toLocaleDateString("ro-RO", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          return (
            <article
              key={review.id}
              className="rounded-2xl border border-surface-200 bg-white p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-surface-900">{review.author}</p>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                        <BadgeCheck className="h-3 w-3" />
                        Cumpărător verificat
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-surface-400">{date}</p>
                </div>
                <StarRating rating={review.rating} />
              </div>
              {review.title && (
                <h4 className="mt-3 font-semibold text-surface-900">{review.title}</h4>
              )}
              <p className="mt-2 text-sm leading-relaxed text-surface-600">
                {review.content}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
