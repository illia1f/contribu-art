"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Select } from "@base-ui/react/select";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { CheckIcon } from "@/components/icons/CheckIcon";

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  accountCreatedYear?: number;
}

export function YearSelector({
  selectedYear,
  onYearChange,
  accountCreatedYear,
}: YearSelectorProps) {
  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  // Show years from account creation year to current year
  // If accountCreatedYear is missing or equals current year (stale session fallback), use 10 years back
  const hasValidCreatedYear =
    accountCreatedYear && accountCreatedYear < currentYear;
  const startYear = hasValidCreatedYear ? accountCreatedYear : currentYear - 9;
  const yearCount = currentYear - startYear + 1;
  const years = Array.from({ length: yearCount }, (_, i) => currentYear - i);

  return (
    <div className="flex items-center gap-3">
      <label className="text-muted-foreground text-sm font-medium">Year:</label>
      <Select.Root
        value={selectedYear.toString()}
        onValueChange={(value) => {
          if (value) onYearChange(parseInt(value));
        }}
        open={open}
        onOpenChange={setOpen}
      >
        <Select.Trigger
          className={cn(
            "px-3 py-2 rounded-md",
            "bg-card border border-border",
            "text-foreground text-sm text-left",
            "focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring",
            "cursor-pointer",
            "flex items-center justify-between gap-2",
            "min-w-[100px]"
          )}
        >
          <Select.Value className="truncate">{selectedYear}</Select.Value>
          <Select.Icon className="shrink-0 text-muted-foreground">
            <ChevronDownIcon className="w-4 h-4" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Positioner
            sideOffset={4}
            side="bottom"
            align="start"
            alignItemWithTrigger={false}
            className="z-50"
          >
            <Select.Popup
              className={cn(
                "bg-card border border-border rounded-md shadow-lg",
                "min-w-[var(--anchor-width)]",
                "max-h-[300px]",
                "flex flex-col",
                "overflow-hidden"
              )}
            >
              <Select.List className="overflow-y-auto p-1">
                {years.map((year) => (
                  <Select.Item
                    key={year}
                    value={year.toString()}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm cursor-pointer",
                      "text-foreground",
                      "hover:bg-muted",
                      "focus:outline-none focus:bg-muted",
                      "data-[selected]:bg-primary/10 data-[selected]:text-primary",
                      "flex items-center justify-between gap-2"
                    )}
                  >
                    <Select.ItemText>{year}</Select.ItemText>
                    <Select.ItemIndicator className="shrink-0">
                      <CheckIcon className="w-4 h-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
