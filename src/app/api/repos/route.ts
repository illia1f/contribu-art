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

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const octokit = new Octokit({ auth: session.accessToken });

  let name: string | undefined;

  try {
    const body = await request.json();
    name = body.name;
    const isPrivate = body.private;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Repository name is required" },
        { status: 400 }
      );
    }

    // Validate repository name (GitHub rules: alphanumeric, hyphens, underscores, dots)
    const repoNameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!repoNameRegex.test(name.trim())) {
      return NextResponse.json(
        {
          error:
            "Repository name can only contain alphanumeric characters, hyphens, underscores, and dots",
        },
        { status: 400 }
      );
    }

    // Create the repository
    const { data: repo } = await octokit.repos.createForAuthenticatedUser({
      name: name.trim(),
      private: isPrivate === true,
      auto_init: true, // Initialize with a README
    });

    // Map to our Repository interface
    const newRepo: Repository = {
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      default_branch: repo.default_branch || "main",
      private: repo.private,
      fork: repo.fork,
    };

    return NextResponse.json(newRepo, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating repository:", error);

    const err = error as {
      status?: number;
      response?: {
        data?: { errors?: { message?: string }[]; message?: string };
      };
      message?: string;
    };

    // Handle specific GitHub API errors
    if (err.status === 422) {
      const message = err.response?.data?.errors?.[0]?.message || err.message;
      if (
        message?.includes("already exists") ||
        message?.includes("name already exists")
      ) {
        return NextResponse.json(
          { error: `A repository with the name "${name}" already exists` },
          { status: 422 }
        );
      }
      return NextResponse.json(
        { error: message || "Invalid repository name or settings" },
        { status: 422 }
      );
    }

    if (err.status === 403) {
      const message = err.response?.data?.message || "";
      if (message.includes("rate limit")) {
        return NextResponse.json(
          {
            error:
              "GitHub API rate limit exceeded. Please try again in a few minutes.",
          },
          { status: 429 }
        );
      }
      return NextResponse.json(
        {
          error:
            "You don't have permission to create repositories. Please check your GitHub account settings.",
        },
        { status: 403 }
      );
    }

    if (err.status === 401) {
      return NextResponse.json(
        { error: "Authentication failed. Please sign in again." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: err.message || "Failed to create repository. Please try again.",
      },
      { status: 500 }
    );
  }
}
