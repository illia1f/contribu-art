"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Repository } from "@/app/api/repos/route";
import { createRepository } from "@/services/repos";

interface CreateRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (repo: Repository) => void;
  defaultName?: string;
}

export function CreateRepoModal({
  isOpen,
  onClose,
  onSuccess,
  defaultName = "contribu-art-graph",
}: CreateRepoModalProps) {
  // State is initialized fresh - parent uses key prop to reset on open
  const [repoName, setRepoName] = useState(defaultName);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isCreating) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, isCreating, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsCreating(true);

    try {
      const data = await createRepository(repoName, isPrivate);
      // Success - call onSuccess callback
      onSuccess(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={!isCreating ? onClose : undefined}
      />

      {/* Modal */}
      <div className="bg-surface-raised border-border relative mx-4 w-full max-w-md rounded-xl border p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-accent/20 flex h-10 w-10 items-center justify-center rounded-full">
            <span className="text-xl">+</span>
          </div>
          <h2 className="text-text text-xl font-bold">Create New Repository</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Repository Name */}
          <div>
            <label
              htmlFor="repo-name"
              className="text-text mb-2 block text-sm font-medium"
            >
              Repository Name
            </label>
            <input
              id="repo-name"
              type="text"
              value={repoName}
              onChange={(e) => {
                setRepoName(e.target.value);
                setError(null);
              }}
              disabled={isCreating}
              placeholder="contribu-art-graph"
              className={cn(
                "w-full rounded-md px-3 py-2",
                "bg-popover border",
                "text-foreground text-sm",
                "focus:ring-ring/50 focus:border-ring focus:ring-2 focus:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50",
                error ? "border-danger" : "border-border"
              )}
              required
            />
            <p className="text-muted-foreground mt-1 text-xs">
              Only alphanumeric characters, hyphens, underscores, and dots are
              allowed
            </p>
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center gap-3">
            <input
              id="repo-private"
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              disabled={isCreating}
              className="border-border text-accent focus:ring-ring/50 h-4 w-4 rounded focus:ring-2"
            />
            <label
              htmlFor="repo-private"
              className="text-text flex cursor-pointer items-center gap-2 text-sm"
            >
              <span>Make this repository private</span>
              <span className="text-muted-foreground">🔒</span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-danger/10 border-danger/20 rounded-lg border p-3">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className={cn(
                "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium",
                "bg-surface-overlay text-text-muted",
                "hover:bg-border hover:text-text",
                "transition-colors",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !repoName.trim()}
              className={cn(
                "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium",
                "bg-accent text-surface",
                "hover:bg-accent/90",
                "transition-colors",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              {isCreating ? "Creating..." : "Create Repository"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
