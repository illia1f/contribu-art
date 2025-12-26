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
  onCreateClick?: () => void;
}

export function RepoSelector({
  repositories,
  selectedRepo,
  onRepoChange,
  isLoading,
  onCreateClick,
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
        <label className="text-muted-foreground text-xs font-medium">
          Repository
        </label>
        <div className="bg-popover border-border text-muted-foreground animate-pulse rounded-md border px-3 py-2 text-sm">
          Loading repositories...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-muted-foreground text-xs font-medium">
          Repository
        </label>
        {onCreateClick && (
          <button
            type="button"
            onClick={onCreateClick}
            className={cn(
              "text-accent hover:text-accent/80 text-xs font-medium",
              "transition-colors"
            )}
          >
            + Create New
          </button>
        )}
      </div>
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
              "w-full rounded-md px-3 py-2 pr-10",
              "bg-popover border-border border",
              "text-foreground text-sm",
              "focus:ring-ring/50 focus:border-ring focus:ring-2 focus:outline-none",
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
            <ChevronDownIcon className="h-4 w-4" />
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
                "bg-popover border-border rounded-md border shadow-lg",
                "w-[var(--anchor-width)]",
                "max-h-[300px]",
                "flex flex-col",
                "overflow-hidden"
              )}
            >
              <Combobox.Empty className="text-muted-foreground px-3 py-2 text-center text-sm">
                No repositories found
              </Combobox.Empty>

              <Combobox.List className="min-h-0 flex-1 overflow-y-auto p-1">
                {(item: string) => {
                  const repo = repositories.find((r) => r.full_name === item);
                  if (!repo) return null;
                  return (
                    <Combobox.Item
                      key={repo.id}
                      value={item}
                      className={cn(
                        "cursor-pointer rounded-md px-3 py-2 text-sm",
                        "text-foreground",
                        "hover:bg-muted",
                        "focus:bg-muted focus:outline-none",
                        "data-[selected]:bg-primary/10 data-[selected]:text-primary",
                        "flex items-center justify-between gap-2"
                      )}
                    >
                      <div className="truncate">
                        {repo.name} {repo.private ? "🔒" : ""}
                      </div>
                      <Combobox.ItemIndicator className="shrink-0">
                        <CheckIcon className="h-4 w-4" />
                      </Combobox.ItemIndicator>
                    </Combobox.Item>
                  );
                }}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
      <p className="text-muted-foreground text-[10px]">
        Commits will be pushed here
      </p>
    </div>
  );
}
