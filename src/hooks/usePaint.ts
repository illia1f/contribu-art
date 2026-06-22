import { useCallback, useEffect, useRef, useState } from "react";
import type { ContributionWeek } from "@/components/ContributionGraph";
import type { CommitMode } from "@/components/CommitModeToggle";
import { paintContributions } from "@/services/paint";
import { toast } from "sonner";

interface UsePaintArgs {
  /** Called when the modal closes after a successful paint. */
  onSuccess: () => void;
  /** GitHub username, used by `viewProfile`. */
  username?: string;
}

interface PaintArgs {
  selectedRepo: string | null;
  selectedCells: Map<string, number>;
  weeks: ContributionWeek[];
  commitMode: CommitMode;
}

/**
 * The paint state machine: streams progress from the paint API, owns the
 * abort controller, and maps network errors to friendly messages.
 */
export function usePaint({ onSuccess, username }: UsePaintArgs) {
  const [isPainting, setIsPainting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState("");
  const [isDone, setIsDone] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Abort any in-flight paint when the consumer unmounts.
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const paint = useCallback(
    async ({ selectedRepo, selectedCells, weeks, commitMode }: PaintArgs) => {
      if (!selectedRepo || selectedCells.size === 0) return;

      const [owner, repo] = selectedRepo.split("/");

      // Build a map of date -> existing contribution count from the graph data.
      const existingContributions = new Map<string, number>();
      weeks.forEach((week) => {
        week.contributionDays.forEach((day) => {
          existingContributions.set(day.date, day.contributionCount);
        });
      });

      // Include existing count in each cell so the API can calculate the delta.
      const cells = Array.from(selectedCells.entries()).map(
        ([date, intensity]) => ({
          date,
          intensity,
          existingCount: existingContributions.get(date) || 0,
        })
      );

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setIsPainting(true);
      setProgress(0);
      setTotal(0);
      setMessage("Initializing...");
      setIsDone(false);

      let lastProgress = 0;
      let lastTotal = 0;
      let receivedDone = false;

      try {
        await paintContributions(
          {
            owner,
            repo,
            cells,
            incremental: commitMode === "incremental",
          },
          (progressEvent) => {
            lastProgress = progressEvent.progress || 0;
            lastTotal = progressEvent.total || 0;
            setProgress(lastProgress);
            setTotal(lastTotal);
            setMessage(progressEvent.message || "");
            if (progressEvent.done) {
              receivedDone = true;
              setIsDone(true);
            }
          },
          abortController.signal
        );

        // If the stream ended without a proper "done" message, it likely means
        // a network error occurred (ECONNRESET, timeout, etc.).
        if (!receivedDone) {
          const progressInfo =
            lastTotal > 0
              ? ` (${lastProgress}/${lastTotal} commits completed)`
              : "";
          setMessage(
            `Error: Connection lost during painting${progressInfo}. Please try again - completed commits are saved.`
          );
          setIsDone(true);
        }
      } catch (error) {
        // If the request was aborted (user navigated away), close silently.
        if (error instanceof Error && error.name === "AbortError") {
          console.debug("Paint operation aborted (user navigated away)");
          setIsPainting(false);
          return;
        }
        console.error("Paint error:", error);
        toast.error("Paint operation failed");
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        let friendlyMessage = errorMessage;
        if (
          errorMessage.includes("ECONNRESET") ||
          errorMessage.includes("fetch failed")
        ) {
          friendlyMessage =
            "Connection to GitHub was lost. Please check your internet and try again.";
        } else if (errorMessage.includes("ETIMEDOUT")) {
          friendlyMessage =
            "Request timed out. GitHub may be slow - please try again.";
        }
        setMessage(`Error: ${friendlyMessage}`);
        setIsDone(true);
      } finally {
        abortControllerRef.current = null;
      }
    },
    []
  );

  const close = useCallback(() => {
    setIsPainting(false);
    if (isDone && !message.toLowerCase().startsWith("error")) {
      onSuccess();
    }
  }, [isDone, message, onSuccess]);

  const viewProfile = useCallback(() => {
    if (username) {
      window.open(`https://github.com/${username}`, "_blank");
    }
    close();
  }, [username, close]);

  return {
    isPainting,
    progress,
    total,
    message,
    isDone,
    paint,
    close,
    viewProfile,
  };
}
