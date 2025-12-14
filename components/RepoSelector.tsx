"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Repository } from "@/app/api/repos/route";
import { Combobox } from "@base-ui/react/combobox";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { CheckIcon } from "@/components/icons/CheckIcon";

interface RepoSelectorProps {
  repositories: Repository[];
  selectedRepo: string | null;
  onRepoChange: (repo: string) => void;
  isLoading?: boolean;
}

export function RepoSelector({
  repositories,
  selectedRepo,
  onRepoChange,
  isLoading,
}: RepoSelectorProps) {
  const [open, setOpen] = useState(false);

  // Create items array for Combobox (using full_name as value)
  const items = repositories.map((repo) => repo.full_name);

  // Custom filter function to search by name or full_name
  const filter = (itemValue: string, query: string) => {
    if (!query.trim()) return true;
    const repo = repositories.find((r) => r.full_name === itemValue);
    if (!repo) return false;
    const lowerQuery = query.toLowerCase();
    return (
      repo.name.toLowerCase().includes(lowerQuery) ||
      repo.full_name.toLowerCase().includes(lowerQuery)
    );
  };

  // Convert item value (full_name) to display label (name)
  const itemToStringLabel = (itemValue: string) => {
    const repo = repositories.find((r) => r.full_name === itemValue);
    return repo ? `${repo.name}${repo.private ? " 🔒" : ""}` : itemValue;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-xs text-muted-foreground font-medium">
          Repository
        </label>
        <div className="px-3 py-2 rounded-md bg-popover border border-border text-muted-foreground text-sm animate-pulse">
          Loading repositories...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-muted-foreground font-medium">
        Repository
      </label>
      <Combobox.Root
        items={items}
        value={selectedRepo ?? null}
        onValueChange={(value) => {
          if (value) onRepoChange(value);
        }}
        open={open}
        onOpenChange={setOpen}
        filter={filter}
        itemToStringLabel={itemToStringLabel}
      >
        <div className="relative flex items-center">
          <Combobox.Input
            placeholder="Search repositories..."
            className={cn(
              "px-3 py-2 rounded-md w-full pr-10",
              "bg-popover border border-border",
              "text-foreground text-sm",
              "focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring",
              "placeholder:text-muted-foreground"
            )}
          />
          <Combobox.Trigger
            className={cn(
              "absolute right-2",
              "text-muted-foreground",
              "hover:text-foreground",
              "focus:outline-none"
            )}
            aria-label="Open popup"
          >
            <ChevronDownIcon className="w-4 h-4" />
          </Combobox.Trigger>
        </div>

        <Combobox.Portal>
          <Combobox.Positioner
            sideOffset={4}
            side="bottom"
            align="start"
            className="z-50"
          >
            <Combobox.Popup
              className={cn(
                "bg-popover border border-border rounded-md shadow-lg",
                "w-[var(--anchor-width)]",
                "max-h-[300px]",
                "flex flex-col",
                "overflow-hidden"
              )}
            >
              <Combobox.Empty className="px-3 py-2 text-sm text-muted-foreground text-center">
                No repositories found
              </Combobox.Empty>

              <Combobox.List className="overflow-y-auto p-1 flex-1 min-h-0">
                {(item: string) => {
                  const repo = repositories.find((r) => r.full_name === item);
                  if (!repo) return null;
                  return (
                    <Combobox.Item
                      key={repo.id}
                      value={item}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm cursor-pointer",
                        "text-foreground",
                        "hover:bg-muted",
                        "focus:outline-none focus:bg-muted",
                        "data-[selected]:bg-primary/10 data-[selected]:text-primary",
                        "flex items-center justify-between gap-2"
                      )}
                    >
                      <div className="truncate">
                        {repo.name} {repo.private ? "🔒" : ""}
                      </div>
                      <Combobox.ItemIndicator className="shrink-0">
                        <CheckIcon className="w-4 h-4" />
                      </Combobox.ItemIndicator>
                    </Combobox.Item>
                  );
                }}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
      <p className="text-[10px] text-muted-foreground">
        Commits will be pushed here
      </p>
    </div>
  );
}
