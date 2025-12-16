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
      e.returnValue = "Painting in progress! Your graph art will be incomplete if you leave.";
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
      <div className="relative bg-surface-raised border border-border rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          {isDone ? (
            hasError ? (
              <div className="w-10 h-10 rounded-full bg-danger/20 flex items-center justify-center">
                <span className="text-xl">❌</span>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
            )
          ) : (
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
              <span className="text-xl">🎨</span>
            </div>
          )}
          <h2 className="text-xl font-bold text-text">
            {isDone
              ? hasError
                ? "Painting Failed"
                : "Painting Complete!"
              : "Painting Your Graph..."}
          </h2>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-3 bg-surface-overlay rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300 ease-out",
                hasError
                  ? "bg-danger"
                  : "bg-gradient-to-r from-contrib-2 via-contrib-3 to-contrib-4"
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-text-muted">
              {progress} / {total} commits
            </p>
            <p className="text-sm font-medium text-text">{percentage}%</p>
          </div>
        </div>

        {/* Status message */}
        <p
          className={cn(
            "text-sm mb-6 p-3 rounded-lg",
            hasError
              ? "bg-danger/10 text-danger border border-danger/20"
              : "bg-surface-overlay text-text-muted"
          )}
        >
          {message}
        </p>

        {/* Warning */}
        {!isDone && (
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-warning text-lg">⚠️</span>
              <div>
                <p className="text-warning font-medium text-sm">
                  Do not close or refresh this page!
                </p>
                <p className="text-warning/80 text-xs mt-1">
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
                "flex-1 px-4 py-2.5 rounded-lg font-medium text-sm",
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
                  "flex-1 px-4 py-2.5 rounded-lg font-medium text-sm",
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

