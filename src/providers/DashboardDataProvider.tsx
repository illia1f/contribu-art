"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ContributionWeek } from "@/components/ContributionGraph";
import type { Repository } from "@/app/api/repos/route";
import { useContributionData } from "@/hooks/useContributionData";
import { useRepositories } from "@/hooks/useRepositories";

interface DashboardDataValue {
  year: number;
  setYear: (year: number) => void;
  weeks: ContributionWeek[];
  isLoadingGraph: boolean;
  refetch: () => Promise<void>;
  repositories: Repository[];
  isLoadingRepos: boolean;
  addRepository: (repo: Repository) => void;
}

const DashboardDataContext = createContext<DashboardDataValue | null>(null);

/** Owns the server data layer: the fetch key `year`, the graph, and the repo list. */
export function DashboardDataProvider({ children }: React.PropsWithChildren) {
  const [year, setYear] = useState(new Date().getFullYear());
  const {
    weeks,
    isLoading: isLoadingGraph,
    refetch,
  } = useContributionData(year);
  const {
    repositories,
    isLoading: isLoadingRepos,
    addRepository,
  } = useRepositories();

  const value = useMemo(
    () => ({
      year,
      setYear,
      weeks,
      isLoadingGraph,
      refetch,
      repositories,
      isLoadingRepos,
      addRepository,
    }),
    [
      year,
      weeks,
      isLoadingGraph,
      refetch,
      repositories,
      isLoadingRepos,
      addRepository,
    ]
  );

  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  const ctx = useContext(DashboardDataContext);
  if (!ctx) {
    throw new Error(
      "useDashboardData must be used within a DashboardDataProvider"
    );
  }
  return ctx;
}
