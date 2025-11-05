"use client";

import { cn } from "@/app/lib/utils";

interface ProgressBadgeProps {
  percentage: number;
  className?: string;
}

export function ProgressBadge({ percentage, className }: ProgressBadgeProps) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <span className="text-sm font-medium text-gray-700">{percentage}%</span>
    </div>
  );
}
