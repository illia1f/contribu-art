import { auth } from "@/lib/auth";
import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  default_branch: string;
  private: boolean;
  fork: boolean;
}

export async function GET() {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const octokit = new Octokit({ auth: session.accessToken });

  try {
    // Fetch user's repositories (owned, not forks, sorted by update date)
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      affiliation: "owner",
      sort: "updated",
      per_page: 100,
    });

    // Filter out forks and map to simpler structure
    const filteredRepos: Repository[] = repos
      .filter((repo) => !repo.fork)
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        default_branch: repo.default_branch || "main",
        private: repo.private,
        fork: repo.fork,
      }));

    return NextResponse.json(filteredRepos);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}

