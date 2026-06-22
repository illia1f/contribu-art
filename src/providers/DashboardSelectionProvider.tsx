"use client";

import { createContext, useContext } from "react";
import { useSelection } from "@/hooks/useSelection";
import { useDashboardData } from "./DashboardDataProvider";

type DashboardSelectionValue = ReturnType<typeof useSelection>;

const DashboardSelectionContext = createContext<DashboardSelectionValue | null>(
  null
);

/**
 * Owns selection/brush state via `useSelection`, reading `weeks`/`year` from the
 * data provider. `useSelection` returns a memoized object, so no extra `useMemo`.
 */
export function DashboardSelectionProvider({
  children,
}: React.PropsWithChildren) {
  const { year, weeks } = useDashboardData();
  const selection = useSelection({ weeks, year });

  return (
    <DashboardSelectionContext.Provider value={selection}>
      {children}
    </DashboardSelectionContext.Provider>
  );
}

export function useDashboardSelection() {
  const ctx = useContext(DashboardSelectionContext);
  if (!ctx) {
    throw new Error(
      "useDashboardSelection must be used within a DashboardSelectionProvider"
    );
  }
  return ctx;
}
