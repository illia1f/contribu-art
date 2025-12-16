/**
 * Fetches repository information from GitHub API
 * @param owner - Repository owner username
 * @param repo - Repository name
 * @returns Promise resolving to repository data including star count
 */
export async function fetchGitHubRepoInfo(
  owner: string,
  repo: string
): Promise<{ stargazers_count: number }> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch repository info: ${res.statusText}`);
  }

  return res.json();
}
