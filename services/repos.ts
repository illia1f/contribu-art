import type { Repository } from "@/app/api/repos/route";

/**
 * Fetches all repositories for the authenticated user
 * @returns Promise resolving to an array of repositories
 */
export async function fetchRepositories(): Promise<Repository[]> {
  const res = await fetch("/api/repos", {
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ error: "Failed to fetch repositories" }));
    throw new Error(error.error || "Failed to fetch repositories");
  }

  return res.json();
}

/**
 * Creates a new repository
 * @param name - Repository name
 * @param isPrivate - Whether the repository should be private
 * @returns Promise resolving to the created repository
 */
export async function createRepository(
  name: string,
  isPrivate: boolean = false
): Promise<Repository> {
  const response = await fetch("/api/repos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      name: name.trim(),
      private: isPrivate,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create repository");
  }

  return data;
}
