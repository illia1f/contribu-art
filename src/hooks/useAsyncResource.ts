import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Loads a resource via `fetcher`, tracking `isLoading` and surfacing failures as
 * a toast. Re-runs whenever `fetcher`'s identity changes, so callers control the
 * fetch key by memoizing `fetcher` over its dependencies (e.g. `year`).
 */
export function useAsyncResource<T>(
  fetcher: () => Promise<T>,
  initial: T,
  errorMessage: string
) {
  const [data, setData] = useState<T>(initial);
  const [isLoading, setIsLoading] = useState(false);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      setData(await fetcher());
    } catch (error) {
      console.error(`${errorMessage}:`, error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, errorMessage]);

  useEffect(() => {
    const load = async () => {
      await refetch();
    };
    load();
  }, [refetch]);

  return { data, setData, isLoading, refetch };
}
