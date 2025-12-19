export function Tips() {
  return (
    <div className="bg-surface-overlay/50 border-border-muted mt-6 rounded-lg border p-4">
      <h3 className="text-text mb-2 text-sm font-medium">Tips</h3>
      <ul className="text-text-muted space-y-1 text-xs">
        <li>• Click and drag to select multiple cells at once</li>
        <li>• Use intensity 0 (clear) to remove existing selections</li>
        <li>
          • Create a dedicated repository for your art to avoid cluttering real
          projects
        </li>
        <li>
          • Commits may take a few minutes to appear on your GitHub profile
        </li>
      </ul>
    </div>
  );
}
