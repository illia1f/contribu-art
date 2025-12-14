"use client";

export function ColorGuide() {
  const colorLevels = [
    {
      level: 0,
      name: "Gray",
      description: "No contributions",
      commits: 0,
      colorClass: "bg-contrib-0",
    },
    {
      level: 1,
      name: "Light Green",
      description: "Low activity",
      commits: 1,
      colorClass: "bg-contrib-1",
    },
    {
      level: 2,
      name: "Medium Green",
      description: "Moderate activity",
      commits: 5,
      colorClass: "bg-contrib-2",
    },
    {
      level: 3,
      name: "High Green",
      description: "High activity",
      commits: 10,
      colorClass: "bg-contrib-3",
    },
    {
      level: 4,
      name: "Max Green",
      description: "Maximum activity",
      commits: 15,
      colorClass: "bg-contrib-4",
    },
  ];

  return (
    <div className="mt-8 p-5 bg-surface-raised rounded-lg border border-border">
      <h3 className="text-base font-semibold text-text mb-4">
        Understanding Contribution Colors
      </h3>

      <div className="mb-4">
        <p className="text-sm text-text-muted mb-4">
          Each color intensity level represents a different contribution level.
          Select an intensity to paint cells on your contribution graph.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
          {colorLevels.map((level) => (
            <div
              key={level.level}
              className="flex items-start gap-3 p-3 bg-surface-overlay/50 rounded border border-border-muted"
            >
              <div
                className={`w-6 h-6 rounded-sm ${level.colorClass} shrink-0 mt-0.5 border border-border-muted`}
              ></div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-text mb-1">
                  Level {level.level}: {level.name}
                </div>
                <div className="text-xs text-text-muted">
                  <div>{level.description}</div>
                  <div className="mt-1 font-mono">{level.commits} commits</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Note */}
      <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
        <div className="flex items-start gap-2">
          <svg
            className="w-4 h-4 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <div className="text-xs font-medium text-yellow-700 dark:text-yellow-300 mb-1">
              Important: Color Accuracy Note
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400">
              GitHub uses a <strong>relative percentile-based system</strong> to
              determine colors, which means the colors you see here may not be a
              100% accurate reflection of what appears on your GitHub profile.
              Colors are calculated based on your personal maximum daily
              contributions, so the same number of commits might appear
              differently depending on your overall activity level. The tool
              targets specific commit counts to achieve each color level, but
              slight variations may occur.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
