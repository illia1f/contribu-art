"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  NONE: "bg-contrib-0",
  FIRST_QUARTILE: "bg-contrib-1",
  SECOND_QUARTILE: "bg-contrib-2",
  THIRD_QUARTILE: "bg-contrib-3",
  FOURTH_QUARTILE: "bg-contrib-4",
};

const paintColors: Record<number, string> = {
  0: "bg-contrib-0",
  1: "bg-contrib-1",
  2: "bg-contrib-2",
  3: "bg-contrib-3",
  4: "bg-contrib-4",
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
      <div className="bg-background border-border rounded-lg border p-5">
        <div className="animate-pulse">
          <div className="overflow-x-auto">
            <Table className="w-auto border-collapse border-none!">
              <TableHeader className="border-none!">
                <TableRow className="border-none! hover:bg-transparent!">
                  <TableHead className="h-6 w-[30px] border-none! p-0" />
                  {Array.from({ length: 53 }).map((_, i) => (
                    <TableHead
                      key={i}
                      className="h-6 border-none! p-0"
                      style={{ width: CELL_WITH_GAP, minWidth: CELL_WITH_GAP }}
                    >
                      {i % 4 === 0 && i < 50 && (
                        <div className="bg-muted h-2.5 w-full rounded" />
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="border-none!">
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <TableRow
                    key={dayIndex}
                    className="h-[13px] border-none! hover:bg-transparent!"
                  >
                    <TableCell className="border-none! p-0 pr-2 text-right align-middle leading-[13px]">
                      {dayIndex % 2 === 1 && (
                        <div className="bg-muted ml-auto h-2.5 w-6 rounded" />
                      )}
                    </TableCell>
                    {Array.from({ length: 53 }).map((_, weekIndex) => (
                      <TableCell
                        key={weekIndex}
                        className="border-none! p-0"
                        style={{
                          width: CELL_SIZE + CELL_GAP,
                          height: CELL_SIZE + CELL_GAP,
                        }}
                      >
                        <div
                          className="bg-muted h-[10px] w-[10px] rounded-[2px] ring-1 ring-white/10 ring-inset"
                          style={{
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            margin: CELL_GAP / 2,
                          }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-3 flex items-center justify-end gap-1.5">
            <div className="bg-muted h-2.5 w-6 rounded" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-muted h-[10px] w-[10px] rounded-[2px]"
              />
            ))}
            <div className="bg-muted h-2.5 w-6 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const monthLabelsList = getMonthLabels();

  return (
    <div
      className="bg-background border-border rounded-lg border p-5 select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="overflow-x-auto">
        <Table className="w-auto border-collapse border-none!">
          <TableHeader className="border-none!">
            <TableRow className="border-none! hover:bg-transparent!">
              {/* Empty cell for day labels column */}
              <TableHead className="h-6 w-[30px] border-none! p-0" />
              {/* Month labels row */}
              {weeks.map((_, weekIndex) => {
                const monthLabel = monthLabelsList.find(
                  (m) => m.index === weekIndex
                );
                return (
                  <TableHead
                    key={weekIndex}
                    className="text-muted-foreground relative h-6 overflow-visible border-none! p-0 pb-1 text-[11px] font-normal"
                    style={{
                      width: CELL_WITH_GAP,
                      minWidth: CELL_WITH_GAP,
                    }}
                  >
                    {monthLabel && (
                      <span className="absolute bottom-1 left-0 whitespace-nowrap">
                        {monthLabel.month}
                      </span>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody className="border-none!">
            {/* Rows for each day of the week */}
            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
              <TableRow
                key={dayIndex}
                className="h-[13px] border-none! hover:bg-transparent!"
              >
                {/* Day label */}
                <TableCell className="text-muted-foreground border-none! p-0 pr-2 text-right align-middle text-[11px] leading-[13px]">
                  {dayIndex % 2 === 1 ? dayLabels[dayIndex] : ""}
                </TableCell>
                {/* Cells for each week */}
                {weeks.map((week, weekIndex) => {
                  const day = week.contributionDays.find((d) => {
                    const date = parseISO(d.date);
                    return date.getDay() === dayIndex;
                  });

                  if (!day) {
                    return (
                      <TableCell
                        key={`${weekIndex}-${dayIndex}`}
                        className="border-none! p-0"
                        style={{
                          width: CELL_SIZE + CELL_GAP,
                          height: CELL_SIZE + CELL_GAP,
                        }}
                      >
                        <div
                          style={{
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            margin: CELL_GAP / 2,
                          }}
                        />
                      </TableCell>
                    );
                  }

                  const isSelected = selectedCells.has(day.date);
                  const paintIntensity = selectedCells.get(day.date);
                  const displayColor = isSelected
                    ? paintColors[paintIntensity!]
                    : levelColors[day.contributionLevel];

                  return (
                    <TableCell
                      key={day.date}
                      className="border-none! p-0"
                      style={{
                        width: CELL_SIZE + CELL_GAP,
                        height: CELL_SIZE + CELL_GAP,
                      }}
                    >
                      <button
                        onMouseDown={() => handleMouseDown(day.date)}
                        onMouseEnter={() => handleMouseEnter(day.date)}
                        className={cn(
                          "block rounded-[2px] transition-all duration-75",
                          "ring-1 ring-inset",
                          displayColor,
                          isSelected
                            ? "relative z-10 ring-2 ring-yellow-400"
                            : "ring-white/20 dark:ring-white/20",
                          "hover:ring-white/45"
                        )}
                        style={{
                          width: CELL_SIZE,
                          height: CELL_SIZE,
                          margin: CELL_GAP / 2,
                        }}
                        title={`${format(parseISO(day.date), "MMM d, yyyy")}: ${
                          day.contributionCount
                        } contributions${isSelected ? " (selected)" : ""}`}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Legend */}
      <div className="text-muted-foreground mt-3 flex items-center justify-end gap-1.5 text-xs">
        <span className="mr-1">Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              "rounded-[2px] ring-1 ring-white/20 ring-inset",
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
