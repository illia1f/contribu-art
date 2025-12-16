"use client";

import { useEffect, useState } from "react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { cn } from "@/lib/utils";
import { fetchGitHubRepoInfo } from "@/services/github";
import { githubRepo, githubRepoUrl } from "@/config/github";
import Link from "next/link";
import { StarIcon } from "./icons/StarIcon";

interface GitHubRepoLinkProps {
  className?: string;
}

export function GitHubRepoLink({ className }: GitHubRepoLinkProps) {
  const [starCount, setStarCount] = useState<number | null>(null);

  useEffect(() => {
    fetchGitHubRepoInfo(githubRepo.owner, githubRepo.repo)
      .then((data) => {
        if (data.stargazers_count !== undefined) {
          setStarCount(data.stargazers_count);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch star count:", error);
        // Silently fail - component will still render without star count
      });
  }, []);

  return (
    <Link
      href={githubRepoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-2",
        "px-3 py-2 rounded-lg",
        "border border-border bg-surface-raised",
        "transition-all duration-200",
        "hover:bg-surface hover:border-primary/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised",
        className
      )}
      aria-label={`View ${githubRepo.owner}/${githubRepo.repo} on GitHub${
        starCount ? ` (${starCount} stars)` : ""
      }`}
    >
      <GitHubIcon className="w-5 h-5 text-text flex-shrink-0" />
      {starCount !== null && (
        <span className="flex items-center gap-1 text-sm font-medium text-text leading-none">
          {starCount > 999 ? `${(starCount / 1000).toFixed(1)}k` : starCount}
          <StarIcon className="w-3.5 h-3.5 text-text flex-shrink-0" />
        </span>
      )}
    </Link>
  );
}
