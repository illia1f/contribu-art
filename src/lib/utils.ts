import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for merging Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Retry helper for transient network errors.
 * Automatically retries on ECONNRESET, ETIMEDOUT, ENOTFOUND, fetch failures, and 5xx errors.
 *
 * @param fn - Async function to retry
 * @param maxRetries - Maximum number of attempts (default: 3)
 * @param delayMs - Base delay between retries in ms (default: 1000)
 * @returns Promise resolving to the function result
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if it's a retryable error (network issues, timeouts, 5xx errors)
      const isRetryable =
        lastError.message.includes("ECONNRESET") ||
        lastError.message.includes("ETIMEDOUT") ||
        lastError.message.includes("ENOTFOUND") ||
        lastError.message.includes("fetch failed") ||
        (error instanceof Error &&
          "status" in error &&
          (error as { status: number }).status >= 500);

      if (!isRetryable || attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }
  throw lastError;
}

/**
 * GitHub Contribution Graph Color Levels
 *
 * IMPORTANT: GitHub uses a RELATIVE percentile-based system, not fixed thresholds.
 * The colors are based on quartiles of YOUR personal maximum daily contributions.
 *
 * For example, if your max daily contributions = 20:
 * - Level 0 (gray):   0 contributions
 * - Level 1 (light):  1-5 contributions (0-25% of max)
 * - Level 2 (medium): 6-10 contributions (25-50% of max)
 * - Level 3 (high):   11-15 contributions (50-75% of max)
 * - Level 4 (max):    16-20 contributions (75-100% of max)
 *
 * For painting purposes, we use target values that will push your graph
 * towards the desired intensity. Higher values ensure the color shows up
 * as expected even with varying personal maximums.
 *
 * @param intensity - The intensity level (0-4)
 * @returns The target number of commits needed to achieve that intensity level
 * @see https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/viewing-contributions-on-your-profile
 */
export function getTargetCommitsForIntensity(intensity: number): number {
  // Target commit counts to achieve each color level
  // These values are designed to reliably produce the desired color
  const targets: Record<number, number> = {
    0: 0, // No contribution (gray)
    1: 1, // Light green - minimum 1
    2: 5, // Medium green - ensures 2nd quartile
    3: 10, // High green - ensures 3rd quartile
    4: 15, // Max green - ensures 4th quartile
  };
  return targets[intensity] ?? 0;
}
