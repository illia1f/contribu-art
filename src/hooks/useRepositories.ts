import { useCallback } from "react";
import type { Repository } from "@/app/api/repos/route";
import { fetchRepositories } from "@/services/repos";
import { useAsyncResource } from "./useAsyncResource";

const EMPTY_REPOS: Repository[] = [];

/**
 * Owns the user's repository list. Fetches once on mount.
 *
 * `addRepository` prepends a newly created repo without a refetch, matching the
 * optimistic insert after repo creation.
 */
export function useRepositories() {
  const fetcher = useCallback(() => fetchRepositories(), []);

  const {
    data: repositories,
    setData,
    isLoading,
  } = useAsyncResource(fetcher, EMPTY_REPOS, "Failed to load repositories");

  const addRepository = useCallback(
    (repo: Repository) => {
      setData((prev) => [repo, ...prev]);
    },
    [setData]
  );

  return { repositories, isLoading, addRepository };
}
