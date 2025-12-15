import type { ContributionCalendar } from "@/app/api/contributions/route";

/**
 * Fetches contribution data for a specific year
 * @param year - The year to fetch contributions for
 * @returns Promise resolving to contribution calendar data
 */
export async function fetchContributions(
  year: number
): Promise<ContributionCalendar> {
  const res = await fetch(`/api/contributions?year=${year}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ error: "Failed to fetch contributions" }));
    throw new Error(error.error || "Failed to fetch contributions");
  }

  return res.json();
}
