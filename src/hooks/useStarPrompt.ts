"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "contribu-art:star-prompt-dismissed";
// "storage" only fires in other tabs, so dispatch CHANGE_EVENT for this one.
const CHANGE_EVENT = "contribu-art:star-prompt-change";

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "true";
  } catch {
    // Storage disabled (e.g. private mode): fail open and show the prompt.
    return true;
  }
}

// No localStorage during SSR; stay hidden so server and first client render agree.
function getServerSnapshot() {
  return false;
}

/**
 * Whether the post-paint "star on GitHub" prompt should show. Dismissal is
 * persisted in localStorage so it never nags again.
 */
export function useStarPrompt() {
  const shouldShow = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore write failures; worst case the prompt reappears next paint.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { shouldShow, dismiss };
}
