import { auth } from "@/lib/auth";
import { Octokit } from "@octokit/rest";

interface PaintCell {
  date: string;
  intensity: number;
  existingCount: number;
}

interface PaintRequest {
  owner: string;
  repo: string;
  cells: PaintCell[];
  incremental?: boolean; // If true, update branch after each cell; if false, update only at the end
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
 * @see https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/viewing-contributions-on-your-profile
 */
function getTargetCommitsForIntensity(intensity: number): number {
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

/**
 * Calculate how many additional commits are needed to reach the target level
 * considering existing contributions on that day.
 */
function getCommitsNeeded(
  targetIntensity: number,
  existingCount: number
): number {
  if (targetIntensity === 0) {
    // Can't remove commits - skip if trying to clear
    return 0;
  }
  const targetCount = getTargetCommitsForIntensity(targetIntensity);
  const needed = targetCount - existingCount;
  return Math.max(0, needed); // Never negative
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.accessToken || !session?.username) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const {
    owner,
    repo,
    cells,
    incremental = false,
  }: PaintRequest = await request.json();

  if (!owner || !repo || !cells || cells.length === 0) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const octokit = new Octokit({ auth: session.accessToken });

  // Calculate total commits needed (accounting for existing contributions)
  const totalCommits = cells.reduce(
    (sum, cell) => sum + getCommitsNeeded(cell.intensity, cell.existingCount),
    0
  );

  // If nothing to do, return early
  if (totalCommits === 0) {
    return new Response(
      JSON.stringify({
        error:
          "No commits needed - all selected cells are already at or above target levels",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let completedCommits = 0;

      const sendProgress = (
        message: string,
        progress: number,
        total: number,
        done: boolean = false
      ) => {
        const data = JSON.stringify({ message, progress, total, done });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      try {
        // Get the default branch reference
        const { data: refData } = await octokit.git
          .getRef({
            owner,
            repo,
            ref: `heads/main`,
          })
          .catch(async () => {
            // Try 'master' if 'main' doesn't exist
            return await octokit.git.getRef({
              owner,
              repo,
              ref: `heads/master`,
            });
          });

        let latestCommitSha = refData.object.sha;
        const branchRef = refData.ref.replace("refs/", "");

        // Get the current commit to get the tree SHA
        const { data: commitData } = await octokit.git.getCommit({
          owner,
          repo,
          commit_sha: latestCommitSha,
        });
        let treeSha = commitData.tree.sha;

        sendProgress("Starting to paint...", 0, totalCommits);

        // Process each cell
        for (const cell of cells) {
          const { date, intensity, existingCount } = cell;
          const commitsNeeded = getCommitsNeeded(intensity, existingCount);

          // Skip if no commits needed for this cell
          if (commitsNeeded === 0) {
            sendProgress(
              `Skipped ${date} (already at ${existingCount} commits, target: ${getTargetCommitsForIntensity(
                intensity
              )})`,
              completedCommits,
              totalCommits
            );
            continue;
          }

          for (let i = 0; i < commitsNeeded; i++) {
            // Check if client disconnected
            if (request.signal.aborted) {
              sendProgress(
                "Cancelled by user",
                completedCommits,
                totalCommits,
                true
              );
              controller.close();
              return;
            }

            // Create a blob with unique content
            const { data: blob } = await octokit.git.createBlob({
              owner,
              repo,
              content: `Contribu-Art\nDate: ${date}\nCommit: ${
                i + 1
              }/${commitsNeeded}\nTimestamp: ${Date.now()}\n`,
              encoding: "utf-8",
            });

            // Create a tree with the new file
            const filename = `.contribu-art/${date.replace(/-/g, "")}_${i}.txt`;
            const { data: newTree } = await octokit.git.createTree({
              owner,
              repo,
              base_tree: treeSha,
              tree: [
                {
                  path: filename,
                  mode: "100644",
                  type: "blob",
                  sha: blob.sha,
                },
              ],
            });

            // Create a commit with the backdated timestamp
            const commitDate = new Date(`${date}T12:00:00Z`).toISOString();
            const { data: newCommit } = await octokit.git.createCommit({
              owner,
              repo,
              message: `🎨 Contribu-Art: ${date}`,
              tree: newTree.sha,
              parents: [latestCommitSha],
              author: {
                name: session.user?.name || session.username,
                email:
                  session.user?.email ||
                  `${session.username}@users.noreply.github.com`,
                date: commitDate,
              },
              committer: {
                name: session.user?.name || session.username,
                email:
                  session.user?.email ||
                  `${session.username}@users.noreply.github.com`,
                date: commitDate,
              },
            });

            latestCommitSha = newCommit.sha;
            treeSha = newTree.sha;
            completedCommits++;

            sendProgress(
              `Painted ${date} (${i + 1}/${commitsNeeded})`,
              completedCommits,
              totalCommits
            );
          }

          // In incremental mode, update branch reference after each date cell
          // This makes commits visible on GitHub progressively
          if (incremental) {
            await octokit.git.updateRef({
              owner,
              repo,
              ref: branchRef,
              sha: latestCommitSha,
            });
          }
        }

        // In transaction mode, update branch reference only at the end
        // All commits become visible at once
        if (!incremental) {
          await octokit.git.updateRef({
            owner,
            repo,
            ref: branchRef,
            sha: latestCommitSha,
          });
        }

        sendProgress(
          "Complete! Your graph has been painted.",
          totalCommits,
          totalCommits,
          true
        );
      } catch (error) {
        console.error("Error painting:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        sendProgress(
          `Error: ${errorMessage}`,
          completedCommits,
          totalCommits,
          true
        );
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
