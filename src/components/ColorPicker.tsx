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
              "w-7 h-7 rounded-sm transition-all duration-150",
              intensityColors[intensity],
              selectedIntensity === intensity
                ? "ring-2 ring-white ring-offset-2 ring-offset-surface scale-110"
                : "hover:ring-1 hover:ring-text-muted"
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
