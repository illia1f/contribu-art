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
      <div className="relative bg-surface-raised border border-border rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-xl">+</span>
          </div>
          <h2 className="text-xl font-bold text-text">Create New Repository</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Repository Name */}
          <div>
            <label
              htmlFor="repo-name"
              className="block text-sm font-medium text-text mb-2"
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
                "w-full px-3 py-2 rounded-md",
                "bg-popover border",
                "text-foreground text-sm",
                "focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                error ? "border-danger" : "border-border"
              )}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
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
              className="w-4 h-4 rounded border-border text-accent focus:ring-ring/50 focus:ring-2"
            />
            <label
              htmlFor="repo-private"
              className="text-sm text-text cursor-pointer flex items-center gap-2"
            >
              <span>Make this repository private</span>
              <span className="text-muted-foreground">🔒</span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-lg p-3">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-lg font-medium text-sm",
                "bg-surface-overlay text-text-muted",
                "hover:bg-border hover:text-text",
                "transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !repoName.trim()}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-lg font-medium text-sm",
                "bg-accent text-surface",
                "hover:bg-accent/90",
                "transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
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
