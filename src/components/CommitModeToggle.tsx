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
      <label className="text-xs text-text-muted font-medium">Commit Mode</label>
      <div className="flex rounded-lg bg-surface-overlay p-1 gap-1">
        <button
          onClick={() => onModeChange("transaction")}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
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
            "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
            mode === "incremental"
              ? "bg-accent text-surface shadow-sm"
              : "text-text-muted hover:text-text hover:bg-surface-raised"
          )}
          title="Commits appear progressively as each cell is painted"
        >
          Gradual
        </button>
      </div>
      <p className="text-[10px] text-text-subtle">
        {mode === "transaction"
          ? "Commits become visible only after all cells are painted"
          : "Commits appear on GitHub as each cell is completed"}
      </p>
    </div>
  );
}
