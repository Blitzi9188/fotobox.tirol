import type { ReviewItem } from "@/lib/types";

type GooglePlaceDetailsResponse = {
  result?: {
    rating?: number;
    user_ratings_total?: number;
    url?: string;
    reviews?: Array<{
      author_name?: string;
      rating?: number;
      relative_time_description?: string;
      text?: string;
      time?: number;
    }>;
  };
  status?: string;
};

type GoogleBusinessProfileReviewsResponse = {
  reviews?: Array<{
    reviewer?: {
      displayName?: string;
    };
    starRating?: string;
    comment?: string;
    updateTime?: string;
    createTime?: string;
  }>;
  averageRating?: number;
  totalReviewCount?: number;
};

export type GoogleReviewsPayload = {
  score?: string;
  reviewCountLabel?: string;
  ctaHref?: string;
  items: ReviewItem[];
};

const STAR_RATING_MAP: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5
};

function buildInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "GR";
}

function formatGoogleReviewDate(unixTime?: number, relative?: string): string {
  if (typeof unixTime === "number" && Number.isFinite(unixTime)) {
    return new Intl.DateTimeFormat("de-AT", {
      month: "long",
      year: "numeric"
    }).format(new Date(unixTime * 1000));
  }

  return (relative || "").trim() || "Aktuell";
}

function formatIsoReviewDate(value?: string): string {
  if (!value) return "Aktuell";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Aktuell";
  return new Intl.DateTimeFormat("de-AT", {
    month: "long",
    year: "numeric"
  }).format(date);
}

export function isGoogleReviewsConfigured(): boolean {
  return Boolean(
    (process.env.GOOGLE_BUSINESS_ACCESS_TOKEN &&
      process.env.GOOGLE_BUSINESS_ACCOUNT_ID &&
      process.env.GOOGLE_BUSINESS_LOCATION_ID) ||
      (process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACE_ID)
  );
}

async function fetchBusinessProfileLatestReviews(limit: number): Promise<GoogleReviewsPayload | null> {
  const accessToken = process.env.GOOGLE_BUSINESS_ACCESS_TOKEN;
  const accountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID;
  const locationId = process.env.GOOGLE_BUSINESS_LOCATION_ID;

  if (!accessToken || !accountId || !locationId) return null;

  const params = new URLSearchParams({
    pageSize: String(limit),
    orderBy: "updateTime desc"
  });

  const response = await fetch(
    `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      next: { revalidate: 1800 }
    }
  );

  if (!response.ok) return null;

  const json = (await response.json()) as GoogleBusinessProfileReviewsResponse;
  const reviews = json.reviews || [];
  if (reviews.length === 0) return null;

  return {
    score:
      typeof json.averageRating === "number" ? json.averageRating.toFixed(1) : undefined,
    reviewCountLabel:
      typeof json.totalReviewCount === "number"
        ? `Basierend auf ${json.totalReviewCount} Bewertungen`
        : undefined,
    ctaHref: "https://g.page/fotoboxtirol/review",
    items: reviews.slice(0, limit).map((review) => {
      const name = review.reviewer?.displayName || "Google Bewertung";
      const rating = STAR_RATING_MAP[String(review.starRating || "").toUpperCase()] || 5;
      return {
        name,
        initials: buildInitials(name),
        date: formatIsoReviewDate(review.updateTime || review.createTime),
        text: (review.comment || "").trim(),
        rating,
        avatarColor: "#ea2c2c"
      };
    })
  };
}

async function fetchPlacesLatestReviews(limit: number): Promise<GoogleReviewsPayload | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) return null;

  const params = new URLSearchParams({
    place_id: placeId,
    fields: "rating,user_ratings_total,reviews,url",
    reviews_sort: "newest",
    language: "de",
    key: apiKey
  });

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`,
    {
      next: { revalidate: 1800 }
    }
  );

  if (!response.ok) return null;

  const json = (await response.json()) as GooglePlaceDetailsResponse;
  const reviews = json.result?.reviews || [];

  if (json.status !== "OK" || reviews.length === 0) {
    return null;
  }

  return {
    score:
      typeof json.result?.rating === "number" ? json.result.rating.toFixed(1) : undefined,
    reviewCountLabel:
      typeof json.result?.user_ratings_total === "number"
        ? `Basierend auf ${json.result.user_ratings_total} Bewertungen`
        : undefined,
    ctaHref: json.result?.url,
    items: reviews.slice(0, limit).map((review) => ({
      name: review.author_name || "Google Bewertung",
      initials: buildInitials(review.author_name || "Google Bewertung"),
      date: formatGoogleReviewDate(review.time, review.relative_time_description),
      text: (review.text || "").trim(),
      rating: Math.max(1, Math.min(5, Math.round(review.rating || 5))),
      avatarColor: "#ea2c2c"
    }))
  };
}

export async function fetchGoogleLatestReviews(limit = 10): Promise<GoogleReviewsPayload | null> {
  const businessProfileReviews = await fetchBusinessProfileLatestReviews(limit);
  if (businessProfileReviews) return businessProfileReviews;
  return fetchPlacesLatestReviews(limit);
}
