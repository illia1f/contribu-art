"use client";

import { cn } from "@/lib/utils";

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
      <label className="text-text-muted text-sm font-medium">Year:</label>
      <select
        value={selectedYear}
        onChange={(e) => onYearChange(parseInt(e.target.value))}
        className={cn(
          "px-3 py-2 rounded-md",
          "bg-surface-raised border border-border",
          "text-text text-sm",
          "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent",
          "cursor-pointer"
        )}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
