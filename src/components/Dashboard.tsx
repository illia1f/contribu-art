"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ConfigurationPanel } from "./ConfigurationPanel";
import { ResultsPanel } from "./ResultsPanel";
import { MobileTabSwitcher, type TabType } from "./MobileTabSwitcher";
import { ProgressModal } from "./ProgressModal";
import { CreateRepoModal } from "./CreateRepoModal";
import type { CommitMode } from "./CommitModeToggle";
import type { ContributionWeek } from "./ContributionGraph";
import type { Repository } from "@/app/api/repos/route";
import type { Session } from "next-auth";
import { fetchContributions } from "@/services/contributions";
import { fetchRepositories } from "@/services/repos";
import { paintContributions } from "@/services/paint";
import { cn, generateRandomCells } from "@/lib/utils";
import { toast } from "sonner";

interface DashboardProps {
  session: Session;
}

export function Dashboard({ session }: DashboardProps) {
  // State
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentIntensity, setCurrentIntensity] = useState(4);
  const [selectedCells, setSelectedCells] = useState<Map<string, number>>(
    new Map()
  );
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [commitMode, setCommitMode] = useState<CommitMode>("transaction");

  // Mobile tab state
  const [activeTab, setActiveTab] = useState<TabType>("config");

  // Auto mode state
  const [autoMode, setAutoMode] = useState(false);
  const [fillDensity, setFillDensity] = useState(5); // 1-10 scale, maps to 10%-100%

  // Data
  const [weeks, setWeeks] = useState<ContributionWeek[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoadingGraph, setIsLoadingGraph] = useState(false);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);

  // Painting state
  const [isPainting, setIsPainting] = useState(false);
  const [paintProgress, setPaintProgress] = useState(0);
  const [paintTotal, setPaintTotal] = useState(0);
  const [paintMessage, setPaintMessage] = useState("");
  const [paintDone, setPaintDone] = useState(false);

  // Create repo modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalKey, setCreateModalKey] = useState(0);

  // Abort controller for cancelling paint operation
  const paintAbortControllerRef = useRef<AbortController | null>(null);

  // Cleanup: abort paint operation when component unmounts
  useEffect(() => {
    return () => {
      if (paintAbortControllerRef.current) {
        paintAbortControllerRef.current.abort();
      }
    };
  }, []);

  // Fetch contributions when year changes
  useEffect(() => {
    const loadContributions = async () => {
      setIsLoadingGraph(true);
      try {
        const data = await fetchContributions(selectedYear);
        setWeeks(data.weeks || []);
      } catch (error) {
        console.error("Failed to fetch contributions:", error);
        toast.error("Failed to load contributions");
      } finally {
        setIsLoadingGraph(false);
      }
    };

    loadContributions();
    // Clear selections when year changes
    setSelectedCells(new Map());
  }, [selectedYear]);

  // Fetch repositories on mount
  useEffect(() => {
    const loadRepositories = async () => {
      setIsLoadingRepos(true);
      try {
        const data = await fetchRepositories();
        setRepositories(data);
      } catch (error) {
        console.error("Failed to fetch repositories:", error);
        toast.error("Failed to load repositories");
      } finally {
        setIsLoadingRepos(false);
      }
    };

    loadRepositories();
  }, []);

  // Handle cell toggle
  const handleCellToggle = useCallback((date: string, intensity: number) => {
    setSelectedCells((prev) => {
      const next = new Map(prev);
      if (intensity === 0 || (prev.has(date) && prev.get(date) === intensity)) {
        next.delete(date);
      } else {
        next.set(date, intensity);
      }
      return next;
    });
  }, []);

  // Handle auto mode toggle
  const handleAutoModeChange = useCallback(
    (enabled: boolean) => {
      setAutoMode(enabled);
      if (enabled) {
        // When enabling auto mode, generate random selections
        const fillPercentage = fillDensity * 10;
        const randomCells = generateRandomCells(weeks, fillPercentage);
        setSelectedCells(randomCells);
      } else {
        // When disabling auto mode, clear selections
        setSelectedCells(new Map());
      }
    },
    [weeks, fillDensity]
  );

  // Handle fill density change
  const handleFillDensityChange = useCallback(
    (density: number) => {
      setFillDensity(density);
      // If auto mode is active, regenerate with new density
      if (autoMode) {
        const fillPercentage = density * 10;
        const randomCells = generateRandomCells(weeks, fillPercentage);
        setSelectedCells(randomCells);
      }
    },
    [autoMode, weeks]
  );

  // Handle regenerate random cells
  const handleRandomize = useCallback(() => {
    const fillPercentage = fillDensity * 10;
    const randomCells = generateRandomCells(weeks, fillPercentage);
    setSelectedCells(randomCells);
  }, [weeks, fillDensity]);

  // Handle paint action
  const handlePaint = async () => {
    if (!selectedRepo || selectedCells.size === 0) return;

    const [owner, repo] = selectedRepo.split("/");

    // Build a map of date -> existing contribution count from the graph data
    const existingContributions = new Map<string, number>();
    weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        existingContributions.set(day.date, day.contributionCount);
      });
    });

    // Include existing count in each cell so API can calculate delta
    const cells = Array.from(selectedCells.entries()).map(
      ([date, intensity]) => ({
        date,
        intensity,
        existingCount: existingContributions.get(date) || 0,
      })
    );

    // Create abort controller for this paint operation
    const abortController = new AbortController();
    paintAbortControllerRef.current = abortController;

    // Reset and open modal
    setIsPainting(true);
    setPaintProgress(0);
    setPaintTotal(0);
    setPaintMessage("Initializing...");
    setPaintDone(false);

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
        (progress) => {
          lastProgress = progress.progress || 0;
          lastTotal = progress.total || 0;
          setPaintProgress(lastProgress);
          setPaintTotal(lastTotal);
          setPaintMessage(progress.message || "");
          if (progress.done) {
            receivedDone = true;
            setPaintDone(true);
          }
        },
        abortController.signal
      );

      // If stream ended without a proper "done" message, it likely means
      // a network error occurred (ECONNRESET, timeout, etc.)
      if (!receivedDone) {
        const progressInfo =
          lastTotal > 0
            ? ` (${lastProgress}/${lastTotal} commits completed)`
            : "";
        setPaintMessage(
          `Error: Connection lost during painting${progressInfo}. Please try again - completed commits are saved.`
        );
        setPaintDone(true);
      }
    } catch (error) {
      // If the request was aborted (user navigated away), close silently with debug log
      if (error instanceof Error && error.name === "AbortError") {
        console.debug("Paint operation aborted (user navigated away)");
        setIsPainting(false);
        return;
      }
      console.error("Paint error:", error);
      toast.error("Paint operation failed");
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      // Provide more user-friendly messages for common network errors
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
      setPaintMessage(`Error: ${friendlyMessage}`);
      setPaintDone(true);
    } finally {
      paintAbortControllerRef.current = null;
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsPainting(false);
    if (paintDone && !paintMessage.toLowerCase().startsWith("error")) {
      // Clear selections after successful paint
      setSelectedCells(new Map());
      // Refresh the graph
      const loadContributions = async () => {
        setIsLoadingGraph(true);
        try {
          const data = await fetchContributions(selectedYear);
          setWeeks(data.weeks || []);
        } catch (error) {
          console.error("Failed to fetch contributions:", error);
          toast.error("Failed to refresh contributions");
        } finally {
          setIsLoadingGraph(false);
        }
      };
      loadContributions();
    }
  };

  // Handle view profile
  const handleViewProfile = () => {
    if (session?.username) {
      window.open(`https://github.com/${session.username}`, "_blank");
    }
    handleModalClose();
  };

  // Handle repository creation success
  const handleRepoCreated = (newRepo: Repository) => {
    // Prepend new repo to the list
    setRepositories((prev) => [newRepo, ...prev]);
    // Select the newly created repo
    setSelectedRepo(newRepo.full_name);
    // Close the modal
    setShowCreateModal(false);
  };

  return (
    <>
      {/* Mobile Tab Switcher */}
      <MobileTabSwitcher
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedCellCount={selectedCells.size}
      />

      {/* Two-Section Layout */}
      <div className="flex min-h-[600px] flex-col lg:flex-row">
        {/* Configuration Section - Left Side */}
        <aside
          className={cn(
            "lg:border-border w-full shrink-0 lg:w-72 lg:border-r lg:pr-6 xl:w-80",
            // Mobile: show/hide based on active tab
            activeTab === "config" ? "block" : "hidden lg:block"
          )}
        >
          <div className="lg:sticky lg:top-4 lg:flex lg:max-h-[calc(100vh-8rem)] lg:flex-col">
            <ConfigurationPanel
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              accountCreatedYear={session?.accountCreatedYear}
              selectedIntensity={currentIntensity}
              onIntensityChange={setCurrentIntensity}
              repositories={repositories}
              selectedRepo={selectedRepo}
              onRepoChange={setSelectedRepo}
              isLoadingRepos={isLoadingRepos}
              onCreateRepoClick={() => {
                setCreateModalKey((k) => k + 1);
                setShowCreateModal(true);
              }}
              commitMode={commitMode}
              onCommitModeChange={setCommitMode}
              onPaint={handlePaint}
              selectedCellCount={selectedCells.size}
              autoMode={autoMode}
              onAutoModeChange={handleAutoModeChange}
              onRandomize={handleRandomize}
              fillDensity={fillDensity}
              onFillDensityChange={handleFillDensityChange}
            />
          </div>
        </aside>

        {/* Preview Section - Right Side (Main Content) */}
        <main
          className={cn(
            "min-w-0 flex-1 lg:pl-6",
            // Mobile: show/hide based on active tab
            activeTab === "preview" ? "block" : "hidden lg:block"
          )}
        >
          <ResultsPanel
            weeks={weeks}
            isLoadingGraph={isLoadingGraph}
            selectedCells={selectedCells}
            onCellToggle={handleCellToggle}
            currentIntensity={currentIntensity}
            onClearSelection={() => setSelectedCells(new Map())}
          />
        </main>
      </div>

      <CreateRepoModal
        key={createModalKey}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleRepoCreated}
        defaultName="contribu-art-graph"
      />

      <ProgressModal
        isOpen={isPainting}
        progress={paintProgress}
        total={paintTotal}
        message={paintMessage}
        isDone={paintDone}
        onClose={handleModalClose}
        onViewProfile={handleViewProfile}
      />
    </>
  );
}
