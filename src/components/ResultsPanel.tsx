"use client";

import { ContributionGraph } from "./ContributionGraph";
import { AlertTriangleIcon } from "@/components/icons/AlertTriangleIcon";
import { TipsPopover } from "./TipsPopover";
import { useDashboardData } from "@/providers/DashboardDataProvider";
import { useDashboardSelection } from "@/providers/DashboardSelectionProvider";

const colorLevels = [
  {
    level: 0,
    name: "None",
    commits: 0,
    colorClass: "bg-contrib-0",
    description: "No commits required",
  },
  {
    level: 1,
    name: "Light",
    commits: 1,
    colorClass: "bg-contrib-1",
    description: "Requires 1-4 commits",
  },
  {
    level: 2,
    name: "Medium",
    commits: 5,
    colorClass: "bg-contrib-2",
    description: "Requires 5-9 commits",
  },
  {
    level: 3,
    name: "High",
    commits: 10,
    colorClass: "bg-contrib-3",
    description: "Requires 10-14 commits",
  },
  {
    level: 4,
    name: "Max",
    commits: 15,
    colorClass: "bg-contrib-4",
    description: "Requires 15+ commits",
  },
];

export function ResultsPanel() {
  const { weeks, isLoadingGraph } = useDashboardData();
  const {
    selectedCells,
    toggleCell: onCellToggle,
    intensity: currentIntensity,
    clear: onClearSelection,
  } = useDashboardSelection();

  return (
    <div className="flex h-full flex-col">
      {/* Graph Container */}
      <div className="flex-1">
        {/* Header with selection info */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Click and drag to select cells
          </p>

          <div className="flex items-center gap-3">
            {/* Selection Info */}
            {selectedCells.size > 0 && (
              <>
                <span className="text-muted-foreground text-sm">
                  <span className="text-foreground font-medium">
                    {selectedCells.size}
                  </span>{" "}
                  {selectedCells.size === 1 ? "cell" : "cells"} selected
                </span>
                <button
                  type="button"
                  onClick={onClearSelection}
                  className="text-accent hover:text-accent/80 text-sm font-medium transition-colors"
                >
                  Clear
                </button>
                <span className="text-border">|</span>
              </>
            )}

            {/* Tips Button */}
            <TipsPopover />
          </div>
        </div>

        {/* Graph */}
        <div className="w-full overflow-x-auto">
          <ContributionGraph
            weeks={weeks}
            selectedCells={selectedCells}
            onCellToggle={onCellToggle}
            currentIntensity={currentIntensity}
            isLoading={isLoadingGraph}
          />
        </div>
      </div>

      {/* Color Guide Section - Beneath the graph */}
      <div className="border-border mt-8 border-t pt-6">
        <h3 className="text-foreground mb-4 text-sm font-medium">
          Contribution Levels
        </h3>

        {/* Color Level Pills */}
        <div className="mb-5 flex flex-wrap gap-3">
          {colorLevels.map((level) => (
            <div
              key={level.level}
              title={level.description}
              className="bg-muted/30 border-border flex cursor-default items-center gap-2 rounded-full border px-3 py-1.5"
            >
              <div
                className={`h-4 w-4 rounded-sm ${level.colorClass} border-border-muted border`}
              />
              <span className="text-muted-foreground text-xs">
                {level.name}
              </span>
              <span className="text-foreground/70 font-mono text-xs">
                {level.commits}
              </span>
            </div>
          ))}
        </div>

        {/* Warning Note */}
        <div className="bg-warning/10 border-warning/20 rounded-md border p-3">
          <div className="flex items-start gap-2">
            <AlertTriangleIcon className="text-warning mt-0.5 h-4 w-4 shrink-0" />
            <div className="flex-1">
              <div className="text-warning mb-1 text-xs font-medium">
                Color Accuracy Note
              </div>
              <div className="text-warning/90 text-xs">
                GitHub uses a relative percentile-based system to determine
                colors. The colors shown here may not exactly match your GitHub
                profile as they depend on your personal contribution history.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
