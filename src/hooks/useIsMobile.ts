"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if the current viewport is mobile-sized.
 * Returns true if the viewport width is less than 768px (Tailwind's md breakpoint).
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();

    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return isMobile;
}
