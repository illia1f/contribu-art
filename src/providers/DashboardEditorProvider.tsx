"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Repository } from "@/app/api/repos/route";
import type { CommitMode } from "@/components/CommitModeToggle";
import { useDashboardData } from "./DashboardDataProvider";

interface DashboardEditorValue {
  accountCreatedYear?: number;
  selectedRepo: string | null;
  setSelectedRepo: (repo: string) => void;
  commitMode: CommitMode;
  setCommitMode: (mode: CommitMode) => void;
  showCreateModal: boolean;
  createModalKey: number;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  handleRepoCreated: (repo: Repository) => void;
}

const DashboardEditorContext = createContext<DashboardEditorValue | null>(null);

/**
 * Owns the editing/config state: target repo, commit mode, and the create-repo
 * modal. Reads `addRepository` from the (outer) data provider to insert a
 * freshly created repo. Selection/brush state lives in the sibling
 * `DashboardSelectionProvider`.
 */
export function DashboardEditorProvider({
  accountCreatedYear,
  children,
}: React.PropsWithChildren<{ accountCreatedYear?: number }>) {
  const { addRepository } = useDashboardData();

  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [commitMode, setCommitMode] = useState<CommitMode>("transaction");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalKey, setCreateModalKey] = useState(0);

  const openCreateModal = useCallback(() => {
    setCreateModalKey((k) => k + 1);
    setShowCreateModal(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false);
  }, []);

  const handleRepoCreated = useCallback(
    (newRepo: Repository) => {
      addRepository(newRepo);
      setSelectedRepo(newRepo.full_name);
      setShowCreateModal(false);
    },
    [addRepository]
  );

  const value = useMemo(
    () => ({
      accountCreatedYear,
      selectedRepo,
      setSelectedRepo,
      commitMode,
      setCommitMode,
      showCreateModal,
      createModalKey,
      openCreateModal,
      closeCreateModal,
      handleRepoCreated,
    }),
    [
      accountCreatedYear,
      selectedRepo,
      commitMode,
      showCreateModal,
      createModalKey,
      openCreateModal,
      closeCreateModal,
      handleRepoCreated,
    ]
  );

  return (
    <DashboardEditorContext.Provider value={value}>
      {children}
    </DashboardEditorContext.Provider>
  );
}

export function useDashboardEditor() {
  const ctx = useContext(DashboardEditorContext);
  if (!ctx) {
    throw new Error(
      "useDashboardEditor must be used within a DashboardEditorProvider"
    );
  }
  return ctx;
}
