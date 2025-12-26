"use client";

import { cn } from "@/lib/utils";

export type TabType = "config" | "preview";

interface MobileTabSwitcherProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  selectedCellCount: number;
}

export function MobileTabSwitcher({
  activeTab,
  onTabChange,
  selectedCellCount,
}: MobileTabSwitcherProps) {
  return (
    <div className="lg:hidden flex border-b border-border mb-4">
      <button
        onClick={() => onTabChange("config")}
        className={cn(
          "flex-1 px-4 py-3 text-sm font-medium transition-colors relative",
          activeTab === "config"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Configuration
        {activeTab === "config" && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
        )}
      </button>
      <button
        onClick={() => onTabChange("preview")}
        className={cn(
          "flex-1 px-4 py-3 text-sm font-medium transition-colors relative",
          activeTab === "preview"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Preview
        {selectedCellCount > 0 && (
          <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-accent/20 text-accent">
            {selectedCellCount}
          </span>
        )}
        {activeTab === "preview" && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
        )}
      </button>
    </div>
  );
}
