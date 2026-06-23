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

const INITIAL_REVIEWS: AdminReview[] = [
  {
    id: "rev_1",
    productId: "1",
    productName: "ChargePro Home 7.4 kW",
    author: "Alexandru M.",
    rating: 5,
    title: "Excelent pentru acasă",
    content: "Instalare rapidă, aplicația funcționează perfect.",
    status: "APPROVED",
    createdAt: "2026-05-10",
  },
  {
    id: "rev_2",
    productId: "2",
    productName: "ChargePro Pro 22 kW",
    author: "Elena P.",
    rating: 4,
    content: "Foarte bună pentru parcarea firmei. Suport tehnic prompt.",
    status: "APPROVED",
    createdAt: "2026-05-28",
  },
  {
    id: "rev_3",
    productId: "3",
    productName: "VoltEdge DC 60 kW",
    author: "Mihai I.",
    rating: 5,
    content: "Stație DC robustă, ideală pentru locație publică.",
    status: "PENDING",
    createdAt: "2026-06-01",
  },
  {
    id: "rev_4",
    productId: "7",
    productName: "EcoWatt Home 7.4 kW",
    author: "Cristina D.",
    rating: 3,
    content: "Produs ok, dar livrarea a întârziat.",
    status: "PENDING",
    createdAt: "2026-06-08",
  },
];

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
