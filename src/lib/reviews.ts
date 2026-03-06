import type { ReviewItem } from "@/lib/types";

const MONTHS: Record<string, number> = {
  januar: 1,
  februar: 2,
  maerz: 3,
  marz: 3,
  april: 4,
  mai: 5,
  juni: 6,
  juli: 7,
  august: 8,
  september: 9,
  oktober: 10,
  november: 11,
  dezember: 12
};

function normalizeToken(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .trim();
}

function parseDateParts(label: string, fallbackYear: number): { month: number; year: number } {
  const trimmed = (label || "").trim();
  if (!trimmed) return { month: 1, year: fallbackYear };

  const yearMatch = trimmed.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? Number(yearMatch[0]) : fallbackYear;
  const monthToken = normalizeToken(trimmed.replace(/\b(19|20)\d{2}\b/g, "").trim());
  const month = MONTHS[monthToken] || 1;
  return { month, year };
}

export function formatReviewDateWithCurrentYear(label: string, currentYear = new Date().getFullYear()): string {
  const trimmed = (label || "").trim();
  if (!trimmed) return String(currentYear);

  const monthPart = trimmed.replace(/\b(19|20)\d{2}\b/g, "").trim();
  return monthPart ? `${monthPart} ${currentYear}` : String(currentYear);
}

export function getSortedLatestReviews(items: ReviewItem[], currentYear = new Date().getFullYear()): ReviewItem[] {
  return [...items].sort((a, b) => {
    const aDate = parseDateParts(a.date || "", currentYear);
    const bDate = parseDateParts(b.date || "", currentYear);
    const aScore = aDate.year * 100 + aDate.month;
    const bScore = bDate.year * 100 + bDate.month;
    return bScore - aScore;
  });
}
