import type { NextApiRequest, NextApiResponse } from "next";

export interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  profile_photo_url: string;
  relative_time_description: string;
}

export interface GoogleReviewsResponse {
  reviews: GoogleReview[];
  rating: number;
  user_ratings_total: number;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GoogleReviewsResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      reviews: [],
      rating: 0,
      user_ratings_total: 0,
      error: "Method not allowed",
    });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  // If API key or Place ID not configured, return empty response
  if (!apiKey || !placeId) {
    return res.status(200).json({
      reviews: [],
      rating: 0,
      user_ratings_total: 0,
      error: "Google API not configured. Add GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID to your .env.local file.",
    });
  }

  try {
    // Fetch place details including reviews
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}&language=en`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Google reviews");
    }

    const data = await response.json();

    if (data.status !== "OK") {
      throw new Error(data.error_message || "Google API error");
    }

    return res.status(200).json({
      reviews: data.result.reviews || [],
      rating: data.result.rating || 0,
      user_ratings_total: data.result.user_ratings_total || 0,
    });
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return res.status(500).json({
      reviews: [],
      rating: 0,
      user_ratings_total: 0,
      error: "Failed to fetch reviews from Google",
    });
  }
}