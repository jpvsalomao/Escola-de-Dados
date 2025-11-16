"use client";

import Link from "next/link";
import { cn } from "@/app/lib/utils";
import { getDifficultyColorClasses } from "@/app/lib/ui-constants";

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
  const isCompleted = completionPercentage === 100;
  const isInProgress = completionPercentage > 0 && completionPercentage < 100;

  return (
    <Link
      href={`/packs/${id}`}
      className="group focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-2xl"
      aria-label={`${title} - ${challengeCount} challenges, ${completionPercentage}% complete, ${difficulty} difficulty`}
    >
      <article
        className={cn(
          "relative h-full glass-strong rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-2",
          isCompleted && "border-2 border-emerald-400/50 shadow-lg shadow-emerald-500/20 hover-glow-green",
          isInProgress && "border-2 border-orange-400/50 shadow-lg shadow-orange-500/20 hover-glow-coral",
          !isCompleted && !isInProgress && "border border-white/50 hover:border-teal-400/50 hover-glow-teal",
          className
        )}
        role="listitem"
      >
        {/* Progress Badge */}
        {isCompleted && (
          <div 
            className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50 glow-green"
            aria-label="Completed"
          >
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {isInProgress && (
          <div
            className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50 glow-coral pulse-badge"
            aria-label={`${completionPercentage}% complete`}
          >
            <span className="text-white text-xs font-bold" aria-hidden="true">{completionPercentage}%</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{challengeCount} challenges</span>
            </div>
            {estimatedTimeMinutes && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>~{estimatedTimeMinutes} min</span>
              </div>
            )}
            {isInProgress && (
              <div className="flex items-center gap-1.5 text-orange-600 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
                getDifficultyColorClasses(difficulty)
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
            <div className="inline-flex items-center gap-2 text-teal-600 font-medium text-sm group-hover:gap-3 transition-all">
              <span>
                {isCompleted ? "Review Pack" : isInProgress ? "Continue Pack" : "Start Pack"}
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
