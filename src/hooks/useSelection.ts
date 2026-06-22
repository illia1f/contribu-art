import { useCallback, useMemo, useState } from "react";
import type { ContributionWeek } from "@/components/ContributionGraph";
import { generateRandomCells } from "@/lib/utils";

interface UseSelectionArgs {
  weeks: ContributionWeek[];
  year: number;
}

/**
 * Owns local selection/brush state: which cells are selected, the active brush
 * intensity, and auto-mode (random fill) settings.
 *
 * Takes `year` to clear the selection when the year changes (as the original
 * did), and `weeks` to generate random cells. Note: unlike the original, an
 * active auto-mode also re-fills for the new year once its `weeks` load.
 */
export function useSelection({ weeks, year }: UseSelectionArgs) {
  const [selectedCells, setSelectedCells] = useState<Map<string, number>>(
    new Map()
  );
  const [intensity, setIntensity] = useState(4);
  const [autoMode, setAutoMode] = useState(false);
  const [fillDensity, setFillDensityState] = useState(5); // 1-10, maps to 10%-100%

  // React's render-phase state-adjustment pattern (no effect / no extra render).
  //
  // Year change clears the selection immediately, but the new year's `weeks`
  // aren't loaded yet (refetch is in flight). If auto mode is on we want the
  // random fill to follow the new year, so we arm `pendingAutoRegen` and run it
  // below once fresh `weeks` arrive. Scoped to year changes only, so the
  // post-paint clear+refetch does not retrigger a fill.
  const [prevYear, setPrevYear] = useState(year);
  const [pendingAutoRegen, setPendingAutoRegen] = useState(false);
  if (prevYear !== year) {
    setPrevYear(year);
    setSelectedCells(new Map());
    setPendingAutoRegen(autoMode);
  }

  const [prevWeeks, setPrevWeeks] = useState(weeks);
  if (prevWeeks !== weeks) {
    setPrevWeeks(weeks);
    if (pendingAutoRegen && weeks.length > 0) {
      setPendingAutoRegen(false);
      setSelectedCells(generateRandomCells(weeks, fillDensity * 10));
    }
  }

  const clear = useCallback(() => {
    setSelectedCells(new Map());
  }, []);

  const toggleCell = useCallback((date: string, cellIntensity: number) => {
    setSelectedCells((prev) => {
      const next = new Map(prev);
      if (
        cellIntensity === 0 ||
        (prev.has(date) && prev.get(date) === cellIntensity)
      ) {
        next.delete(date);
      } else {
        next.set(date, cellIntensity);
      }
      return next;
    });
  }, []);

  const setAutoModeEnabled = useCallback(
    (enabled: boolean) => {
      setAutoMode(enabled);
      if (enabled) {
        setSelectedCells(generateRandomCells(weeks, fillDensity * 10));
      } else {
        setSelectedCells(new Map());
      }
    },
    [weeks, fillDensity]
  );

  const setFillDensity = useCallback(
    (density: number) => {
      setFillDensityState(density);
      if (autoMode) {
        setSelectedCells(generateRandomCells(weeks, density * 10));
      }
    },
    [autoMode, weeks]
  );

  const randomize = useCallback(() => {
    const randomCells = generateRandomCells(weeks, fillDensity * 10);
    setSelectedCells(randomCells);
  }, [weeks, fillDensity]);

  return useMemo(
    () => ({
      selectedCells,
      intensity,
      setIntensity,
      autoMode,
      setAutoMode: setAutoModeEnabled,
      fillDensity,
      setFillDensity,
      toggleCell,
      randomize,
      clear,
    }),
    [
      selectedCells,
      intensity,
      autoMode,
      setAutoModeEnabled,
      fillDensity,
      setFillDensity,
      toggleCell,
      randomize,
      clear,
    ]
  );
}
