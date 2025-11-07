"use client";

import Link from "next/link";
import { cn } from "@/app/lib/utils";

interface PackCardProps {
  id: string;
  title: string;
  description: string;
  challengeCount: number;
  completionPercentage: number;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTimeMinutes?: number;
  className?: string;
}

export function PackCard({
  id,
  title,
  description,
  challengeCount,
  completionPercentage,
  tags,
  difficulty,
  estimatedTimeMinutes,
  className,
}: PackCardProps) {
  const difficultyColors = {
    beginner: "bg-emerald-100 text-emerald-800 border-emerald-200",
    intermediate: "bg-amber-100 text-amber-800 border-amber-200",
    advanced: "bg-rose-100 text-rose-800 border-rose-200",
  };

  const isCompleted = completionPercentage === 100;
  const isInProgress = completionPercentage > 0 && completionPercentage < 100;

  return (
    <Link href={`/packs/${id}`} className="group">
      <div
        className={cn(
          "relative h-full bg-white border-2 border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1",
          isCompleted && "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md",
          isInProgress && "border-blue-300",
          !isCompleted && !isInProgress && "hover:border-blue-300",
          className
        )}
      >
        {/* Progress Badge */}
        {isCompleted && (
          <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {isInProgress && (
          <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-xs font-bold">{completionPercentage}%</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{challengeCount} challenges</span>
            </div>
            {estimatedTimeMinutes && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>~{estimatedTimeMinutes} min</span>
              </div>
            )}
            {isInProgress && (
              <div className="flex items-center gap-1.5 text-blue-600 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>In Progress</span>
              </div>
            )}
          </div>

          {/* Tags and Difficulty */}
          <div className="flex gap-2 flex-wrap pt-2 border-t border-gray-100">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border",
                difficultyColors[difficulty]
              )}
            >
              {difficulty}
            </span>

            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
              >
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="inline-flex items-center px-2 py-1.5 rounded-lg text-xs font-medium text-gray-500">
                +{tags.length - 2}
              </span>
            )}
          </div>

          {/* Start Button */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all">
              <span>
                {isCompleted ? "Review Pack" : isInProgress ? "Continue Pack" : "Start Pack"}
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
