"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { usePaint } from "@/hooks/usePaint";
import { useDashboardData } from "./DashboardDataProvider";
import { useDashboardEditor } from "./DashboardEditorProvider";
import { useDashboardSelection } from "./DashboardSelectionProvider";

interface DashboardPaintValue {
  isPainting: boolean;
  progress: number;
  total: number;
  message: string;
  isDone: boolean;
  /** Start a paint using the current repo/cells/weeks/commit mode. */
  paint: () => void;
  close: () => void;
  viewProfile: () => void;
}

const DashboardPaintContext = createContext<DashboardPaintValue | null>(null);

/**
 * Owns the paint state machine. Reads its inputs (repo, commit mode, cells,
 * weeks) from the outer providers, and wires `onSuccess` to refetch + clear.
 */
export function DashboardPaintProvider({
  username,
  children,
}: React.PropsWithChildren<{ username?: string }>) {
  const { weeks, refetch } = useDashboardData();
  const { selectedRepo, commitMode } = useDashboardEditor();
  const { selectedCells, clear } = useDashboardSelection();

  const onSuccess = useCallback(() => {
    clear();
    refetch();
  }, [clear, refetch]);

  const {
    isPainting,
    progress,
    total,
    message,
    isDone,
    paint,
    close,
    viewProfile,
  } = usePaint({ onSuccess, username });

  // Bind the paint machine to the current editor/data state so consumers can
  // trigger it with no arguments (matching the original `onPaint` callback).
  const handlePaint = useCallback(() => {
    paint({ selectedRepo, selectedCells, weeks, commitMode });
  }, [paint, selectedRepo, selectedCells, weeks, commitMode]);

  const value = useMemo(
    () => ({
      isPainting,
      progress,
      total,
      message,
      isDone,
      paint: handlePaint,
      close,
      viewProfile,
    }),
    [
      isPainting,
      progress,
      total,
      message,
      isDone,
      handlePaint,
      close,
      viewProfile,
    ]
  );

  return (
    <DashboardPaintContext.Provider value={value}>
      {children}
    </DashboardPaintContext.Provider>
  );
}

export function useDashboardPaint() {
  const ctx = useContext(DashboardPaintContext);
  if (!ctx) {
    throw new Error(
      "useDashboardPaint must be used within a DashboardPaintProvider"
    );
  }
  return ctx;
}
