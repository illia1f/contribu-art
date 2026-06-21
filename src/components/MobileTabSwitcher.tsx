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
    <div className="border-border mb-4 flex border-b lg:hidden">
      <button
        onClick={() => onTabChange("config")}
        className={cn(
          "relative flex-1 px-4 py-3 text-sm font-medium transition-colors",
          activeTab === "config"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Configuration
        {activeTab === "config" && (
          <span className="bg-accent absolute right-0 bottom-0 left-0 h-0.5" />
        )}
      </button>
      <button
        onClick={() => onTabChange("preview")}
        className={cn(
          "relative flex-1 px-4 py-3 text-sm font-medium transition-colors",
          activeTab === "preview"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Preview
        {selectedCellCount > 0 && (
          <span className="bg-accent/20 text-accent ml-2 rounded-full px-1.5 py-0.5 text-xs">
            {selectedCellCount}
          </span>
        )}
        {activeTab === "preview" && (
          <span className="bg-accent absolute right-0 bottom-0 left-0 h-0.5" />
        )}
      </button>
    </div>
  );
}
