interface PaintCell {
  date: string;
  intensity: number;
  existingCount: number;
}

interface PaintRequest {
  owner: string;
  repo: string;
  cells: PaintCell[];
  incremental: boolean;
}

interface PaintProgress {
  progress: number;
  total: number;
  message: string;
  done?: boolean;
}

type PaintProgressCallback = (progress: PaintProgress) => void;

/**
 * Paints contributions to a repository
 * @param request - Paint request parameters
 * @param onProgress - Optional callback for progress updates
 * @param signal - Optional AbortSignal to cancel the operation
 * @returns Promise that resolves when painting is complete
 */
export async function paintContributions(
  request: PaintRequest,
  onProgress?: PaintProgressCallback,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch("/api/paint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    signal,
    body: JSON.stringify({
      owner: request.owner,
      repo: request.repo,
      cells: request.cells,
      incremental: request.incremental,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to start painting");
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error("No response stream");
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data: PaintProgress = JSON.parse(line.slice(6));
          if (onProgress) {
            onProgress(data);
          }
          if (data.done) {
            return;
          }
        } catch (parseError) {
          // Log parse errors for debugging but don't break the stream
          console.warn("Failed to parse SSE event:", {
            line: line.substring(0, 100),
            error: parseError instanceof Error ? parseError.message : String(parseError),
          });
        }
      }
    }
  }
}
