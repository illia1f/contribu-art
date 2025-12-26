"use client";

import { cn } from "@/lib/utils";

interface PaintButtonProps {
  onClick: () => void;
  disabled?: boolean;
  selectedCount: number;
}

export function PaintButton({ onClick, disabled, selectedCount }: PaintButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full px-6 py-3 rounded-lg font-medium text-base",
        "transition-all duration-200",
        disabled
          ? "bg-muted text-muted-foreground cursor-not-allowed"
          : "bg-gradient-to-r from-contrib-3 to-contrib-4 text-background hover:from-contrib-4 hover:to-contrib-4 hover:shadow-lg hover:shadow-accent/20"
      )}
    >
      <span className="flex items-center justify-center gap-2">
        <span>🎨</span>
        <span>
          Paint My Graph
          {selectedCount > 0 && (
            <span className="ml-1 opacity-80">({selectedCount})</span>
          )}
        </span>
      </span>
    </button>
  );
}

