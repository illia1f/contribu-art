"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { StarIcon } from "@/components/icons/StarIcon";
import { githubRepoUrl } from "@/config/github";
import { useStarPrompt } from "@/hooks/useStarPrompt";
import { cn } from "@/lib/utils";

export function StarCallout() {
  const { shouldShow, dismiss } = useStarPrompt();

  if (!shouldShow) return null;

  const handleStar = () => {
    track("star_click");
    dismiss();
  };

  const handleDismiss = () => {
    track("star_dismiss");
    dismiss();
  };

  return (
    <div className="bg-surface-overlay border-border mb-6 rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <span className="text-xl">⭐</span>
        <div className="flex-1">
          <p className="text-text text-sm font-medium">
            Enjoying Contribu-Art?
          </p>
          <p className="text-text-muted mt-1 text-xs">
            A star on GitHub helps a lot and takes a second.
          </p>
          <div className="mt-3 flex items-center gap-4">
            <Link
              href={githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleStar}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium",
                "bg-accent text-surface hover:bg-accent/90",
                "transition-colors"
              )}
            >
              <StarIcon className="h-4 w-4" />
              Star on GitHub
            </Link>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-text-muted hover:text-text text-xs transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
