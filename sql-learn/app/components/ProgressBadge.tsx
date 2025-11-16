"use client";

import { cn } from "@/app/lib/utils";

interface ProgressBadgeProps {
  percentage: number;
  className?: string;
}

export function ProgressBadge({ percentage, className }: ProgressBadgeProps) {
  const getColor = () => {
    if (percentage === 100) return "bg-gradient-to-r from-emerald-500 to-emerald-600";
    if (percentage >= 75) return "bg-gradient-to-r from-teal-500 to-teal-600";
    if (percentage >= 50) return "bg-gradient-to-r from-cyan-500 to-cyan-600";
    if (percentage >= 25) return "bg-gradient-to-r from-orange-500 to-orange-600";
    return "bg-gradient-to-r from-gray-400 to-gray-500";
  };

  return (
    <div className={cn("inline-flex flex-col gap-2", className)}>
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-[160px] h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out shadow-sm progress-fill-animate",
              getColor()
            )}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="flex items-center gap-1.5">
          {percentage === 100 && (
            <svg className="w-5 h-5 text-emerald-600 animate-bounce-in" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          <span className={cn(
            "text-base font-bold",
            percentage === 100 ? "text-emerald-600 number-pop" : "text-gray-700"
          )}>
            {percentage}%
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-500 text-right">
        {percentage === 100 ? "All challenges completed!" : "Keep going!"}
      </p>
    </div>
  );
}
