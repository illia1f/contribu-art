"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "./Header";
import { YearSelector } from "./YearSelector";
import { ColorPicker } from "./ColorPicker";
import { ColorGuide } from "./ColorGuide";
import { RepoSelector } from "./RepoSelector";
import { ContributionGraph, ContributionWeek } from "./ContributionGraph";
import { PaintButton } from "./PaintButton";
import { ProgressModal } from "./ProgressModal";
import { CommitModeToggle, type CommitMode } from "./CommitModeToggle";
import type { Repository } from "../app/api/repos/route";
import type { Session } from "next-auth";

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

  // Fetch contributions when year changes
  useEffect(() => {
    const fetchContributions = async () => {
      setIsLoadingGraph(true);
      try {
        const res = await fetch(`/api/contributions?year=${selectedYear}`);
        if (res.ok) {
          const data = await res.json();
          setWeeks(data.weeks || []);
        }
      } catch (error) {
        console.error("Failed to fetch contributions:", error);
      } finally {
        setIsLoadingGraph(false);
      }
    };

    fetchContributions();
    // Clear selections when year changes
    setSelectedCells(new Map());
  }, [selectedYear]);

  // Fetch repositories on mount
  useEffect(() => {
    const fetchRepos = async () => {
      setIsLoadingRepos(true);
      try {
        const res = await fetch("/api/repos");
        if (res.ok) {
          const data = await res.json();
          setRepositories(data);
        }
      } catch (error) {
        console.error("Failed to fetch repositories:", error);
      } finally {
        setIsLoadingRepos(false);
      }
    };

    fetchRepos();
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

    try {
      const response = await fetch("/api/paint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner,
          repo,
          cells,
          incremental: commitMode === "incremental",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setPaintMessage(`Error: ${error.error || "Failed to start painting"}`);
        setPaintDone(true);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setPaintMessage("Error: No response stream");
        setPaintDone(true);
        return;
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              setPaintProgress(data.progress || 0);
              setPaintTotal(data.total || 0);
              setPaintMessage(data.message || "");
              if (data.done) {
                setPaintDone(true);
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error("Paint error:", error);
      setPaintMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
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
      const fetchContributions = async () => {
        setIsLoadingGraph(true);
        try {
          const res = await fetch(`/api/contributions?year=${selectedYear}`);
          if (res.ok) {
            const data = await res.json();
            setWeeks(data.weeks || []);
          }
        } catch (error) {
          console.error("Failed to fetch contributions:", error);
        } finally {
          setIsLoadingGraph(false);
        }
      };
      fetchContributions();
    }
  };

  // Handle view profile
  const handleViewProfile = () => {
    if (session?.username) {
      window.open(`https://github.com/${session.username}`, "_blank");
    }
    handleModalClose();
  };

  return (
    <>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-6 mb-6">
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
        <div className="mb-6 p-4 bg-surface-raised rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div className="text-text-muted text-sm">
              <span className="font-medium text-text">
                {selectedCells.size}
              </span>{" "}
              cells selected
            </div>
            <button
              onClick={() => setSelectedCells(new Map())}
              className="text-text-muted text-sm hover:text-text transition-colors"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Repository selection and paint button */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 p-5 bg-surface-raised rounded-lg border border-border">
        {/* Left side: Repository and Commit Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <RepoSelector
            repositories={repositories}
            selectedRepo={selectedRepo}
            onRepoChange={setSelectedRepo}
            isLoading={isLoadingRepos}
          />
          <CommitModeToggle mode={commitMode} onModeChange={setCommitMode} />
        </div>

        {/* Right side: Paint Button */}
        <div className="flex items-center justify-center sm:justify-end lg:items-center pt-2 sm:pt-0">
          <PaintButton
            onClick={handlePaint}
            disabled={!selectedRepo || selectedCells.size === 0}
            selectedCount={selectedCells.size}
          />
        </div>
      </div>

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
