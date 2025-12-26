"use client";

import { useState } from "react";
import { YearSelector } from "./YearSelector";
import { ColorPicker } from "./ColorPicker";
import { RepoSelector } from "./RepoSelector";
import { CommitModeToggle, type CommitMode } from "./CommitModeToggle";
import { PaintButton } from "./PaintButton";
import type { Repository } from "@/app/api/repos/route";
import { cn } from "@/lib/utils";

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
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-left hover:bg-muted/30 transition-colors -mx-1 px-1 rounded"
      >
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <svg
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200",
            isOpen ? "rotate-180" : ""
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={cn(
          "transition-all duration-200",
          isOpen ? "max-h-96 pb-4 overflow-visible" : "max-h-0 overflow-hidden"
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
}: ConfigurationPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1">
        {/* Time Period Section */}
        <CollapsibleSection title="Time Period" defaultOpen={true}>
          <div className="space-y-3">
            <YearSelector
              selectedYear={selectedYear}
              onYearChange={onYearChange}
              accountCreatedYear={accountCreatedYear}
            />
          </div>
        </CollapsibleSection>

        {/* Brush Settings Section */}
        <CollapsibleSection title="Brush Settings" defaultOpen={true}>
          <div className="space-y-3">
            <ColorPicker
              selectedIntensity={selectedIntensity}
              onIntensityChange={onIntensityChange}
            />
          </div>
        </CollapsibleSection>

        {/* Target Repository Section */}
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

        {/* Commit Options Section */}
        <CollapsibleSection title="Commit Options" defaultOpen={true}>
          <div className="space-y-3">
            <CommitModeToggle
              mode={commitMode}
              onModeChange={onCommitModeChange}
            />
          </div>
        </CollapsibleSection>
      </div>

      {/* Action Button - Fixed at bottom */}
      <div className="pt-4 mt-4 border-t border-border">
        <PaintButton
          onClick={onPaint}
          disabled={!selectedRepo || selectedCellCount === 0}
          selectedCount={selectedCellCount}
        />
      </div>
    </div>
  );
}
