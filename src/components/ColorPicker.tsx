"use client";

import { cn, getTargetCommitsForIntensity } from "@/lib/utils";

interface ColorPickerProps {
  selectedIntensity: number;
  onIntensityChange: (intensity: number) => void;
}

const intensityColors: Record<number, string> = {
  0: "bg-contrib-0",
  1: "bg-contrib-1",
  2: "bg-contrib-2",
  3: "bg-contrib-3",
  4: "bg-contrib-4",
};

const intensityLabels: Record<number, string> = {
  0: "Clear",
  1: "Light",
  2: "Medium",
  3: "High",
  4: "Max",
};

export function ColorPicker({
  selectedIntensity,
  onIntensityChange,
}: ColorPickerProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-text-muted text-sm font-medium">Intensity:</span>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((intensity) => (
          <button
            key={intensity}
            onClick={() => onIntensityChange(intensity)}
            title={`${
              intensityLabels[intensity]
            } (target: ${getTargetCommitsForIntensity(intensity)} commits)`}
            className={cn(
              "h-7 w-7 rounded-sm ring-1 ring-white/20 transition-all duration-150 ring-inset",
              intensityColors[intensity],
              selectedIntensity === intensity
                ? "ring-offset-background scale-110 ring-2 ring-white ring-offset-2"
                : "hover:ring-white/50"
            )}
          />
        ))}
      </div>
      <span className="text-text-subtle text-xs">
        {intensityLabels[selectedIntensity]} (
        {getTargetCommitsForIntensity(selectedIntensity)} commits)
      </span>
    </div>
  );
}
