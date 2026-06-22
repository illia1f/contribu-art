import { useCallback } from "react";
import type { ContributionWeek } from "@/components/ContributionGraph";
import { fetchContributions } from "@/services/contributions";
import { useAsyncResource } from "./useAsyncResource";

const EMPTY_WEEKS: ContributionWeek[] = [];

/**
 * Owns contribution-graph data for a given year.
 *
 * `refetch` is reused by both the year-change reload and the post-paint success
 * callback, so they share one load path.
 */
export function useContributionData(year: number) {
  const fetcher = useCallback(
    () => fetchContributions(year).then((data) => data.weeks || []),
    [year]
  );

  const {
    data: weeks,
    isLoading,
    refetch,
  } = useAsyncResource(fetcher, EMPTY_WEEKS, "Failed to load contributions");

  return { weeks, isLoading, refetch };
}
