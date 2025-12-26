"use client";

import { useState } from "react";
import { YearSelector } from "./YearSelector";
import { ColorPicker } from "./ColorPicker";
import { RepoSelector } from "./RepoSelector";
import { CommitModeToggle, type CommitMode } from "./CommitModeToggle";
import { PaintButton } from "./PaintButton";
import type { Repository } from "@/app/api/repos/route";
import { cn } from "@/lib/utils";
import { Slider } from "./ui/slider";
import { ChevronDownIcon } from "./icons/ChevronDownIcon";
import { RefreshIcon } from "./icons/RefreshIcon";

interface ConfigurationPanelProps {
  // Year settings
  selectedYear: number;
  onYearChange: (year: number) => void;
  accountCreatedYear?: number;

  // Color/intensity settings
  selectedIntensity: number;
  onIntensityChange: (intensity: number) => void;

  // Repository settings
  repositories: Repository[];
  selectedRepo: string | null;
  onRepoChange: (repo: string) => void;
  isLoadingRepos: boolean;
  onCreateRepoClick: () => void;

  // Commit mode settings
  commitMode: CommitMode;
  onCommitModeChange: (mode: CommitMode) => void;

  // Paint action
  onPaint: () => void;
  selectedCellCount: number;

  // Auto mode settings
  autoMode: boolean;
  onAutoModeChange: (enabled: boolean) => void;
  onRandomize: () => void;
  fillDensity: number;
  onFillDensityChange: (density: number) => void;
}

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-border border-b last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:bg-muted/30 -mx-1 flex w-full items-center justify-between rounded px-1 py-3 text-left transition-colors"
      >
        <h3 className="text-foreground text-sm font-medium">{title}</h3>
        <ChevronDownIcon
          className={cn(
            "text-muted-foreground h-4 w-4 transition-transform duration-200",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>
      <div
        className={cn(
          "transition-all duration-200",
          isOpen ? "max-h-96 overflow-visible pb-4" : "max-h-0 overflow-hidden"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ConfigurationPanel({
  selectedYear,
  onYearChange,
  accountCreatedYear,
  selectedIntensity,
  onIntensityChange,
  repositories,
  selectedRepo,
  onRepoChange,
  isLoadingRepos,
  onCreateRepoClick,
  commitMode,
  onCommitModeChange,
  onPaint,
  selectedCellCount,
  autoMode,
  onAutoModeChange,
  onRandomize,
  fillDensity,
  onFillDensityChange,
}: ConfigurationPanelProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Scrollable Content */}
      <div className="flex-1">
        <CollapsibleSection title="Time Period" defaultOpen={true}>
          <div className="space-y-3">
            <YearSelector
              selectedYear={selectedYear}
              onYearChange={onYearChange}
              accountCreatedYear={accountCreatedYear}
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Auto Mode" defaultOpen={true}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-muted-foreground text-sm">
                  Randomly paint empty cells with varying intensities
                </p>
              </div>
              <button
                onClick={() => onAutoModeChange(!autoMode)}
                className={cn(
                  "focus:ring-primary focus:ring-offset-background relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none",
                  autoMode ? "bg-primary" : "bg-muted"
                )}
                role="switch"
                aria-checked={autoMode}
              >
                <span
                  className={cn(
                    "bg-background pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out",
                    autoMode ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
            {autoMode && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Fill Density
                    </span>
                    <span className="text-sm font-medium">
                      {fillDensity * 10}%
                    </span>
                  </div>
                  <Slider
                    value={[fillDensity]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) =>
                      onFillDensityChange(
                        Array.isArray(value) ? value[0] : value
                      )
                    }
                  />
                </div>
                <button
                  onClick={onRandomize}
                  className="border-border bg-background hover:bg-muted flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors"
                >
                  <RefreshIcon />
                  Regenerate
                </button>
              </>
            )}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Brush Settings" defaultOpen={true}>
          <div className="space-y-3">
            <ColorPicker
              selectedIntensity={selectedIntensity}
              onIntensityChange={onIntensityChange}
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Target Repository" defaultOpen={true}>
          <div className="space-y-4">
            <RepoSelector
              repositories={repositories}
              selectedRepo={selectedRepo}
              onRepoChange={onRepoChange}
              isLoading={isLoadingRepos}
              onCreateClick={onCreateRepoClick}
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Commit Options" defaultOpen={true}>
          <div className="space-y-3">
            <CommitModeToggle
              mode={commitMode}
              onModeChange={onCommitModeChange}
            />
          </div>
        </CollapsibleSection>
      </div>

      <div className="border-border mt-4 border-t pt-4">
        <PaintButton
          onClick={onPaint}
          disabled={!selectedRepo || selectedCellCount === 0}
          selectedCount={selectedCellCount}
        />
      </div>
    </div>
  );
}
