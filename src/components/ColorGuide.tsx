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
    <div className="bg-card border-border mt-8 rounded-lg border p-5">
      <h3 className="text-foreground mb-4 text-base font-semibold">
        Understanding Contribution Colors
      </h3>

      <div className="mb-4">
        <p className="text-muted-foreground mb-4 text-sm">
          Each color intensity level represents a different contribution level.
          Select an intensity to paint cells on your contribution graph.
        </p>

        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {colorLevels.map((level) => (
            <div
              key={level.level}
              className="bg-popover/50 border-border-muted flex items-start gap-3 rounded border p-3"
            >
              <div
                className={`h-6 w-6 rounded-sm ${level.colorClass} border-border-muted mt-0.5 shrink-0 border ring-1 ring-white/20 ring-inset`}
              ></div>
              <div className="min-w-0 flex-1">
                <div className="text-foreground mb-1 text-xs font-medium">
                  Level {level.level}: {level.name}
                </div>
                <div className="text-muted-foreground text-xs">
                  <div>{level.description}</div>
                  <div className="mt-1 font-mono">{level.commits} commits</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Note */}
      <div className="bg-warning/10 border-warning/20 rounded-md border p-3">
        <div className="flex items-start gap-2">
          <AlertTriangleIcon className="text-warning mt-0.5 h-4 w-4 shrink-0" />
          <div className="flex-1">
            <div className="text-warning mb-1 text-xs font-medium">
              Important: Color Accuracy Note
            </div>
            <div className="text-warning/90 text-xs">
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
