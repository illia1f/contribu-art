"use client";

import { useState, useEffect, useCallback } from "react";
import { YearSelector } from "./YearSelector";
import { ColorPicker } from "./ColorPicker";
import { RepoSelector } from "./RepoSelector";
import { ContributionGraph, ContributionWeek } from "./ContributionGraph";
import { PaintButton } from "./PaintButton";
import { ProgressModal } from "./ProgressModal";
import { CreateRepoModal } from "./CreateRepoModal";
import { CommitModeToggle, type CommitMode } from "./CommitModeToggle";
import type { Repository } from "@/app/api/repos/route";
import type { Session } from "next-auth";
import { fetchContributions } from "@/services/contributions";
import { fetchRepositories } from "@/services/repos";
import { paintContributions } from "@/services/paint";

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

  // Fetch contributions when year changes
  useEffect(() => {
    const loadContributions = async () => {
      setIsLoadingGraph(true);
      try {
        const data = await fetchContributions(selectedYear);
        setWeeks(data.weeks || []);
      } catch (error) {
        console.error("Failed to fetch contributions:", error);
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
        }
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
      console.error("Paint error:", error);
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
      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-6">
        <YearSelector
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          accountCreatedYear={session?.accountCreatedYear}
        />
        <ColorPicker
          selectedIntensity={currentIntensity}
          onIntensityChange={setCurrentIntensity}
        />
      </div>

      {/* Contribution Graph */}
      <div className="mb-6">
        <ContributionGraph
          weeks={weeks}
          selectedCells={selectedCells}
          onCellToggle={handleCellToggle}
          currentIntensity={currentIntensity}
          isLoading={isLoadingGraph}
        />
      </div>

      {/* Selection info */}
      {selectedCells.size > 0 && (
        <div className="bg-surface-raised border-border mb-6 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="text-text-muted text-sm">
              <span className="text-text font-medium">
                {selectedCells.size}
              </span>{" "}
              cells selected
            </div>
            <button
              onClick={() => setSelectedCells(new Map())}
              className="text-text-muted hover:text-text text-sm transition-colors"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Repository selection and paint button */}
      <div className="bg-surface-raised border-border grid grid-cols-1 gap-4 rounded-lg border p-5 lg:grid-cols-[1fr_auto]">
        {/* Left side: Repository and Commit Mode */}
        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
          <RepoSelector
            repositories={repositories}
            selectedRepo={selectedRepo}
            onRepoChange={setSelectedRepo}
            isLoading={isLoadingRepos}
            onCreateClick={() => {
              setCreateModalKey((k) => k + 1);
              setShowCreateModal(true);
            }}
          />
          <CommitModeToggle mode={commitMode} onModeChange={setCommitMode} />
        </div>

        {/* Right side: Paint Button */}
        <div className="flex items-center justify-center pt-2 sm:justify-end sm:pt-0 lg:items-center">
          <PaintButton
            onClick={handlePaint}
            disabled={!selectedRepo || selectedCells.size === 0}
            selectedCount={selectedCells.size}
          />
        </div>
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
