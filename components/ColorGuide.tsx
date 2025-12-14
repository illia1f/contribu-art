import { AlertTriangleIcon } from "@/components/icons/AlertTriangleIcon";

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

export function ColorGuide() {
  return (
    <div className="mt-8 p-5 bg-card rounded-lg border border-border">
      <h3 className="text-base font-semibold text-foreground mb-4">
        Understanding Contribution Colors
      </h3>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-4">
          Each color intensity level represents a different contribution level.
          Select an intensity to paint cells on your contribution graph.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
          {colorLevels.map((level) => (
            <div
              key={level.level}
              className="flex items-start gap-3 p-3 bg-popover/50 rounded border border-border-muted"
            >
              <div
                className={`w-6 h-6 rounded-sm ${level.colorClass} shrink-0 mt-0.5 border border-border-muted`}
              ></div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-foreground mb-1">
                  Level {level.level}: {level.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  <div>{level.description}</div>
                  <div className="mt-1 font-mono">{level.commits} commits</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Note */}
      <div className="p-3 bg-warning/10 border border-warning/20 rounded-md">
        <div className="flex items-start gap-2">
          <AlertTriangleIcon className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs font-medium text-warning mb-1">
              Important: Color Accuracy Note
            </div>
            <div className="text-xs text-warning/90">
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
