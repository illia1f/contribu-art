"use client";

import { ContributionGraph, ContributionWeek } from "./ContributionGraph";
import { AlertTriangleIcon } from "@/components/icons/AlertTriangleIcon";
import { TipsPopover } from "./TipsPopover";

interface ResultsPanelProps {
  // Graph data
  weeks: ContributionWeek[];
  isLoadingGraph: boolean;

  // Selection state
  selectedCells: Map<string, number>;
  onCellToggle: (date: string, intensity: number) => void;
  currentIntensity: number;

  // Selection actions
  onClearSelection: () => void;
}

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

export function ResultsPanel({
  weeks,
  isLoadingGraph,
  selectedCells,
  onCellToggle,
  currentIntensity,
  onClearSelection,
}: ResultsPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Graph Container */}
      <div className="flex-1">
        {/* Header with selection info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Click and drag to select cells
          </p>

          <div className="flex items-center gap-3">
            {/* Selection Info */}
            {selectedCells.size > 0 && (
              <>
                <span className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {selectedCells.size}
                  </span>{" "}
                  {selectedCells.size === 1 ? "cell" : "cells"} selected
                </span>
                <button
                  onClick={onClearSelection}
                  className="text-sm text-accent hover:text-accent/80 font-medium transition-colors"
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
      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-sm font-medium text-foreground mb-4">
          Contribution Levels
        </h3>

        {/* Color Level Pills */}
        <div className="flex flex-wrap gap-3 mb-5">
          {colorLevels.map((level) => (
            <div
              key={level.level}
              title={level.description}
              className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-full border border-border cursor-default"
            >
              <div
                className={`w-4 h-4 rounded-sm ${level.colorClass} border border-border-muted`}
              />
              <span className="text-xs text-muted-foreground">
                {level.name}
              </span>
              <span className="text-xs font-mono text-foreground/70">
                {level.commits}
              </span>
            </div>
          ))}
        </div>

        {/* Warning Note */}
        <div className="p-3 bg-warning/10 border border-warning/20 rounded-md">
          <div className="flex items-start gap-2">
            <AlertTriangleIcon className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-xs font-medium text-warning mb-1">
                Color Accuracy Note
              </div>
              <div className="text-xs text-warning/90">
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
