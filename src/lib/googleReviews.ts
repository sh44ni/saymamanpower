/* eslint-disable @typescript-eslint/no-unused-vars */
import { GoogleReview } from "@/pages/api/google-reviews";

export async function fetchGoogleReviews() {
  try {
    const response = await fetch("/api/google-reviews");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return {
      reviews: [],
      rating: 0,
      user_ratings_total: 0,
      error: "Failed to load reviews",
    };
  }
}

export function formatGoogleReviewDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatGoogleReviewDateAr(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}