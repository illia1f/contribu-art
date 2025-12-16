export function Tips() {
  return (
    <div className="mt-6 p-4 bg-surface-overlay/50 rounded-lg border border-border-muted">
      <h3 className="text-sm font-medium text-text mb-2">Tips</h3>
      <ul className="text-xs text-text-muted space-y-1">
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
