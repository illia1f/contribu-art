"use client";

import { cn } from "@/lib/utils";

export type CommitMode = "transaction" | "incremental";

interface CommitModeToggleProps {
  mode: CommitMode;
  onModeChange: (mode: CommitMode) => void;
}

export function CommitModeToggle({
  mode,
  onModeChange,
}: CommitModeToggleProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-text-muted text-xs font-medium">Commit Mode</label>
      <div className="bg-surface-overlay flex gap-1 rounded-lg p-1">
        <button
          onClick={() => onModeChange("transaction")}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
            mode === "transaction"
              ? "bg-accent text-surface shadow-sm"
              : "text-text-muted hover:text-text hover:bg-surface-raised"
          )}
          title="All commits appear at once when painting completes"
        >
          All at once
        </button>
        <button
          onClick={() => onModeChange("incremental")}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
            mode === "incremental"
              ? "bg-accent text-surface shadow-sm"
              : "text-text-muted hover:text-text hover:bg-surface-raised"
          )}
          title="Commits appear progressively as each cell is painted"
        >
          Gradual
        </button>
      </div>
      <p className="text-text-subtle text-[10px]">
        {mode === "transaction"
          ? "Commits become visible only after all cells are painted"
          : "Commits appear on GitHub as each cell is completed"}
      </p>
    </div>
  );
}
