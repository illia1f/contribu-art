"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProgressModalProps {
  isOpen: boolean;
  progress: number;
  total: number;
  message: string;
  isDone: boolean;
  onClose: () => void;
  onViewProfile: () => void;
}

export function ProgressModal({
  isOpen,
  progress,
  total,
  message,
  isDone,
  onClose,
  onViewProfile,
}: ProgressModalProps) {
  // Prevent page navigation while in progress
  useEffect(() => {
    if (!isOpen || isDone) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        "Painting in progress! Your graph art will be incomplete if you leave.";
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isOpen, isDone]);

  if (!isOpen) return null;

  const percentage = total > 0 ? Math.round((progress / total) * 100) : 0;
  const hasError = message.toLowerCase().startsWith("error");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="bg-surface-raised border-border relative mx-4 w-full max-w-md rounded-xl border p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          {isDone ? (
            hasError ? (
              <div className="bg-danger/20 flex h-10 w-10 items-center justify-center rounded-full">
                <span className="text-xl">❌</span>
              </div>
            ) : (
              <div className="bg-accent/20 flex h-10 w-10 items-center justify-center rounded-full">
                <span className="text-xl">✅</span>
              </div>
            )
          ) : (
            <div className="bg-accent/20 flex h-10 w-10 animate-pulse items-center justify-center rounded-full">
              <span className="text-xl">🎨</span>
            </div>
          )}
          <h2 className="text-text text-xl font-bold">
            {isDone
              ? hasError
                ? "Painting Failed"
                : "Painting Complete!"
              : "Painting Your Graph..."}
          </h2>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="bg-surface-overlay h-3 overflow-hidden rounded-full">
            <div
              className={cn(
                "h-full transition-all duration-300 ease-out",
                hasError
                  ? "bg-danger"
                  : "from-contrib-2 via-contrib-3 to-contrib-4 bg-gradient-to-r"
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-text-muted text-sm">
              {progress} / {total} commits
            </p>
            <p className="text-text text-sm font-medium">{percentage}%</p>
          </div>
        </div>

        {/* Status message */}
        <p
          className={cn(
            "mb-6 rounded-lg p-3 text-sm",
            hasError
              ? "bg-danger/10 text-danger border-danger/20 border"
              : "bg-surface-overlay text-text-muted"
          )}
        >
          {message}
        </p>

        {/* Warning */}
        {!isDone && (
          <div className="bg-warning/10 border-warning/30 mb-6 rounded-lg border p-4">
            <div className="flex items-start gap-3">
              <span className="text-warning text-lg">⚠️</span>
              <div>
                <p className="text-warning text-sm font-medium">
                  Do not close or refresh this page!
                </p>
                <p className="text-warning/80 mt-1 text-xs">
                  The painting process will stop if you navigate away.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {isDone && (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className={cn(
                "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium",
                "bg-surface-overlay text-text-muted",
                "hover:bg-border hover:text-text",
                "transition-colors"
              )}
            >
              Close
            </button>
            {!hasError && (
              <button
                onClick={onViewProfile}
                className={cn(
                  "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium",
                  "bg-accent text-surface",
                  "hover:bg-accent/90",
                  "transition-colors"
                )}
              >
                View GitHub Profile
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
