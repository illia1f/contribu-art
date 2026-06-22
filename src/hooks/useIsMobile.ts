"use client";

import { useSyncExternalStore } from "react";

// Tailwind's md breakpoint.
const MOBILE_BREAKPOINT = 768;

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

// During SSR there is no viewport; default to desktop and let the client
// reconcile on the first commit.
function getServerSnapshot() {
  return false;
}

/**
 * Hook to detect if the current viewport is mobile-sized.
 * Returns true if the viewport width is less than 768px (Tailwind's md breakpoint).
 *
 * Uses useSyncExternalStore so the correct value is read during the initial
 * render instead of after a mount-only effect (avoids an extra render).
 */
export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
