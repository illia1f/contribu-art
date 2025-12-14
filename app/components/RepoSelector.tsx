"use client";

import { cn } from "@/lib/utils";
import type { Repository } from "@/app/api/repos/route";

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
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-xs text-text-muted font-medium">
          Repository
        </label>
        <div className="px-3 py-2 rounded-md bg-surface-overlay border border-border text-text-muted text-sm animate-pulse">
          Loading repositories...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-text-muted font-medium">Repository</label>
      <select
        value={selectedRepo || ""}
        onChange={(e) => onRepoChange(e.target.value)}
        className={cn(
          "px-3 py-2 rounded-md w-full",
          "bg-surface-overlay border border-border",
          "text-text text-sm",
          "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent",
          "cursor-pointer",
          "appearance-none bg-no-repeat bg-right",
          "[background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")]",
          "bg-size-[16px] bg-position-[right_8px_center] pr-8"
        )}
      >
        <option value="" disabled>
          Select a repository
        </option>
        {repositories.map((repo) => (
          <option key={repo.id} value={repo.full_name}>
            {repo.name} {repo.private ? "🔒" : ""}
          </option>
        ))}
      </select>
      <p className="text-[10px] text-text-subtle">
        Commits will be pushed here
      </p>
    </div>
  );
}
