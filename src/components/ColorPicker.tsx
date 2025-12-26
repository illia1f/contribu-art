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
    <div className="flex flex-col gap-2">
      <label className="text-muted-foreground text-xs font-medium">
        Intensity
      </label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((intensity) => (
          <button
            key={intensity}
            onClick={() => onIntensityChange(intensity)}
            title={`${
              intensityLabels[intensity]
            } (target: ${getTargetCommitsForIntensity(intensity)} commits)`}
            className={cn(
              "border-border-muted h-8 w-8 rounded-md border transition-all duration-150",
              intensityColors[intensity],
              selectedIntensity === intensity
                ? "ring-offset-card scale-105 ring-2 ring-white ring-offset-2"
                : "hover:ring-muted-foreground hover:scale-105 hover:ring-1"
            )}
            aria-label={`${intensityLabels[intensity]} intensity`}
          />
        ))}
      </div>
      <p className="text-muted-foreground text-[10px]">
        {intensityLabels[selectedIntensity]} -{" "}
        {getTargetCommitsForIntensity(selectedIntensity)} commits per cell
      </p>
    </div>
  );
}
