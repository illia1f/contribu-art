"use client";

import { useState } from "react";
import { ConfigurationPanel } from "./ConfigurationPanel";
import { ResultsPanel } from "./ResultsPanel";
import { MobileTabSwitcher, type TabType } from "./MobileTabSwitcher";
import { ProgressModal } from "./ProgressModal";
import { CreateRepoModal } from "./CreateRepoModal";
import type { Session } from "next-auth";
import { cn } from "@/lib/utils";
import { DashboardDataProvider } from "@/providers/DashboardDataProvider";
import {
  DashboardEditorProvider,
  useDashboardEditor,
} from "@/providers/DashboardEditorProvider";
import {
  DashboardSelectionProvider,
  useDashboardSelection,
} from "@/providers/DashboardSelectionProvider";
import {
  DashboardPaintProvider,
  useDashboardPaint,
} from "@/providers/DashboardPaintProvider";

interface DashboardProps {
  session: Session;
}

export function Dashboard({ session }: DashboardProps) {
  // Nested outer -> inner so each provider can read the ones outside it.
  return (
    <DashboardDataProvider>
      <DashboardEditorProvider accountCreatedYear={session?.accountCreatedYear}>
        <DashboardSelectionProvider>
          <DashboardPaintProvider username={session?.username}>
            <DashboardShell />
          </DashboardPaintProvider>
        </DashboardSelectionProvider>
      </DashboardEditorProvider>
    </DashboardDataProvider>
  );
}

/** Layout shell. Owns the mobile tab state; reads everything else from context. */
function DashboardShell() {
  const [activeTab, setActiveTab] = useState<TabType>("config");

  const {
    showCreateModal,
    createModalKey,
    closeCreateModal,
    handleRepoCreated,
  } = useDashboardEditor();
  const { selectedCells } = useDashboardSelection();
  const { isPainting, progress, total, message, isDone, close, viewProfile } =
    useDashboardPaint();

  return (
    <>
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
            <ConfigurationPanel />
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
          <ResultsPanel />
        </main>
      </div>

      <CreateRepoModal
        key={createModalKey}
        isOpen={showCreateModal}
        onClose={closeCreateModal}
        onSuccess={handleRepoCreated}
        defaultName="contribu-art-graph"
      />

      <ProgressModal
        isOpen={isPainting}
        progress={progress}
        total={total}
        message={message}
        isDone={isDone}
        onClose={close}
        onViewProfile={viewProfile}
      />
    </>
  );
}
