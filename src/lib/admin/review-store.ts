export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AdminReview {
  id: string;
  productId: string;
  productName: string;
  author: string;
  rating: number;
  title?: string;
  content: string;
  status: ReviewStatus;
  createdAt: string;
}

const INITIAL_REVIEWS: AdminReview[] = [];

let reviews: AdminReview[] = [...INITIAL_REVIEWS];

export function getAdminReviews(): AdminReview[] {
  return reviews;
}

export function getReviewById(id: string): AdminReview | undefined {
  return reviews.find((r) => r.id === id);
}

export function updateReviewStatus(id: string, status: ReviewStatus): AdminReview | null {
  const idx = reviews.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  reviews[idx] = { ...reviews[idx], status };
  return reviews[idx];
}

export function deleteReview(id: string): boolean {
  const before = reviews.length;
  reviews = reviews.filter((r) => r.id !== id);
  return reviews.length < before;
}

/** Recenzii aprobate pentru afișare pe produs și schema.org — doar date reale, moderate. */
export function getApprovedReviewsForProduct(productId: string) {
  return getAdminReviews()
    .filter((r) => r.status === "APPROVED" && r.productId === productId)
    .map((r) => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      title: r.title,
      content: r.content,
      date: r.createdAt,
      verified: true,
    }));
}
