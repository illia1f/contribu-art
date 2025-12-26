"use client";

import { cn } from "@/lib/utils";

interface PaintButtonProps {
  onClick: () => void;
  disabled?: boolean;
  selectedCount: number;
}

export function PaintButton({
  onClick,
  disabled,
  selectedCount,
}: PaintButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full rounded-lg px-6 py-3 text-base font-medium",
        "transition-all duration-200",
        disabled
          ? "bg-muted text-muted-foreground cursor-not-allowed"
          : "from-contrib-3 to-contrib-4 text-background hover:from-contrib-4 hover:to-contrib-4 hover:shadow-accent/20 bg-gradient-to-r hover:shadow-lg"
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
