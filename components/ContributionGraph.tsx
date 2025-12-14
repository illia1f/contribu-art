"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

export interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionGraphProps {
  weeks: ContributionWeek[];
  selectedCells: Map<string, number>;
  onCellToggle: (date: string, intensity: number) => void;
  currentIntensity: number;
  isLoading?: boolean;
}

const levelColors: Record<string, string> = {
  NONE: "bg-[#161b22]",
  FIRST_QUARTILE: "bg-[#0e4429]",
  SECOND_QUARTILE: "bg-[#006d32]",
  THIRD_QUARTILE: "bg-[#26a641]",
  FOURTH_QUARTILE: "bg-[#39d353]",
};

const paintColors: Record<number, string> = {
  0: "bg-[#161b22]",
  1: "bg-[#0e4429]",
  2: "bg-[#006d32]",
  3: "bg-[#26a641]",
  4: "bg-[#39d353]",
};

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Cell dimensions matching GitHub's style
const CELL_SIZE = 10;
const CELL_GAP = 3;
const CELL_WITH_GAP = CELL_SIZE + CELL_GAP;

export function ContributionGraph({
  weeks,
  selectedCells,
  onCellToggle,
  currentIntensity,
  isLoading,
}: ContributionGraphProps) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [paintMode, setPaintMode] = useState<"add" | "remove" | null>(null);

  const handleMouseDown = useCallback(
    (date: string) => {
      setIsMouseDown(true);
      const isSelected = selectedCells.has(date);
      setPaintMode(isSelected ? "remove" : "add");
      onCellToggle(date, currentIntensity);
    },
    [selectedCells, onCellToggle, currentIntensity]
  );

  const handleMouseEnter = useCallback(
    (date: string) => {
      if (!isMouseDown || !paintMode) return;

      const isSelected = selectedCells.has(date);
      if (paintMode === "add" && !isSelected) {
        onCellToggle(date, currentIntensity);
      } else if (paintMode === "remove" && isSelected) {
        onCellToggle(date, 0);
      }
    },
    [isMouseDown, paintMode, selectedCells, onCellToggle, currentIntensity]
  );

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
    setPaintMode(null);
  }, []);

  // Get month labels for the header
  const getMonthLabels = () => {
    const labels: { month: string; index: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      if (week.contributionDays.length > 0) {
        const firstDay = week.contributionDays[0];
        const month = parseISO(firstDay.date).getMonth();
        if (month !== lastMonth) {
          labels.push({ month: monthLabels[month], index: weekIndex });
          lastMonth = month;
        }
      }
    });

    return labels;
  };

  if (isLoading) {
    return (
      <div className="p-5 bg-surface-raised rounded-lg border border-border">
        <div className="animate-pulse">
          <div className="overflow-x-auto">
            <table className="border-collapse" style={{ borderSpacing: 0 }}>
              <thead>
                <tr>
                  <td className="w-[30px]"></td>
                  {Array.from({ length: 53 }).map((_, i) => (
                    <td
                      key={i}
                      className="pb-1"
                      style={{ width: CELL_WITH_GAP }}
                    >
                      {i % 4 === 0 && i < 50 && (
                        <div className="h-2.5 w-full bg-surface-overlay rounded" />
                      )}
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <tr key={dayIndex}>
                    <td className="pr-2 text-right align-middle">
                      {dayIndex % 2 === 1 && (
                        <div className="h-2.5 w-6 bg-surface-overlay rounded ml-auto" />
                      )}
                    </td>
                    {Array.from({ length: 53 }).map((_, weekIndex) => (
                      <td
                        key={weekIndex}
                        style={{
                          padding: CELL_GAP / 2,
                        }}
                      >
                        <div
                          className="w-[10px] h-[10px] rounded-[2px] bg-surface-overlay"
                          style={{
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-end gap-1.5 mt-3">
            <div className="h-2.5 w-6 bg-surface-overlay rounded" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-[10px] h-[10px] rounded-[2px] bg-surface-overlay"
              />
            ))}
            <div className="h-2.5 w-6 bg-surface-overlay rounded" />
          </div>
        </div>
      </div>
    );
  }

  const monthLabelsList = getMonthLabels();

  return (
    <div
      className="p-5 bg-surface-raised rounded-lg border border-border select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="overflow-x-auto">
        <table className="border-collapse" style={{ borderSpacing: 0 }}>
          <thead>
            <tr>
              {/* Empty cell for day labels column */}
              <td className="w-[30px]"></td>
              {/* Month labels row */}
              {weeks.map((_, weekIndex) => {
                const monthLabel = monthLabelsList.find(
                  (m) => m.index === weekIndex
                );
                return (
                  <td
                    key={weekIndex}
                    className="text-xs text-text-muted font-normal pb-1"
                    style={{
                      width: CELL_WITH_GAP,
                      fontSize: "11px",
                    }}
                  >
                    {monthLabel?.month || ""}
                  </td>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {/* Rows for each day of the week */}
            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
              <tr key={dayIndex}>
                {/* Day label */}
                <td
                  className="text-text-muted pr-2 text-right align-middle"
                  style={{ fontSize: "11px" }}
                >
                  {dayIndex % 2 === 1 ? dayLabels[dayIndex] : ""}
                </td>
                {/* Cells for each week */}
                {weeks.map((week, weekIndex) => {
                  const day = week.contributionDays.find((d) => {
                    const date = parseISO(d.date);
                    return date.getDay() === dayIndex;
                  });

                  if (!day) {
                    return (
                      <td
                        key={`${weekIndex}-${dayIndex}`}
                        style={{
                          width: CELL_SIZE,
                          height: CELL_SIZE,
                          padding: CELL_GAP / 2,
                        }}
                      />
                    );
                  }

                  const isSelected = selectedCells.has(day.date);
                  const paintIntensity = selectedCells.get(day.date);
                  const displayColor = isSelected
                    ? paintColors[paintIntensity!]
                    : levelColors[day.contributionLevel];

                  return (
                    <td
                      key={day.date}
                      style={{
                        padding: CELL_GAP / 2,
                      }}
                    >
                      <button
                        onMouseDown={() => handleMouseDown(day.date)}
                        onMouseEnter={() => handleMouseEnter(day.date)}
                        className={cn(
                          "block rounded-[2px] transition-all duration-75",
                          "outline outline-1 outline-offset-[-1px]",
                          displayColor,
                          isSelected
                            ? "outline-yellow-400 outline-2"
                            : "outline-[rgba(27,31,35,0.06)] dark:outline-[rgba(255,255,255,0.05)]",
                          "hover:outline-[rgba(255,255,255,0.4)]"
                        )}
                        style={{
                          width: CELL_SIZE,
                          height: CELL_SIZE,
                        }}
                        title={`${format(parseISO(day.date), "MMM d, yyyy")}: ${
                          day.contributionCount
                        } contributions${isSelected ? " (selected)" : ""}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-3 text-xs text-text-muted">
        <span className="mr-1">Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              "rounded-[2px] outline outline-1 outline-offset-[-1px] outline-[rgba(255,255,255,0.05)]",
              paintColors[level]
            )}
            style={{ width: CELL_SIZE, height: CELL_SIZE }}
          />
        ))}
        <span className="ml-1">More</span>
      </div>
    </div>
  );
}
