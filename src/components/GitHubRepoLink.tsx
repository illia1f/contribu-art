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
        "rounded-lg px-3 py-2",
        "border-border bg-surface-raised border",
        "transition-all duration-200",
        "hover:bg-surface hover:border-primary/50",
        "focus-visible:ring-primary focus-visible:ring-offset-surface-raised focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        className
      )}
      aria-label={`View ${githubRepo.owner}/${githubRepo.repo} on GitHub${
        starCount ? ` (${starCount} stars)` : ""
      }`}
    >
      <GitHubIcon className="text-text h-5 w-5 flex-shrink-0" />
      {starCount !== null && (
        <span className="text-text flex items-center gap-1 text-sm leading-none font-medium">
          {starCount > 999 ? `${(starCount / 1000).toFixed(1)}k` : starCount}
          <StarIcon className="text-text h-3.5 w-3.5 flex-shrink-0" />
        </span>
      )}
    </Link>
  );
}
