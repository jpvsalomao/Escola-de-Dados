"use client";

import Link from "next/link";
import { cn } from "@/app/lib/utils";
import type { Challenge } from "@/app/lib/types";

interface ChallengeCardProps {
  challenge: Challenge;
  packId: string;
  completed?: boolean;
  className?: string;
  index?: number;
}

export function ChallengeCard({
  challenge,
  packId,
  completed = false,
  className,
  index,
}: ChallengeCardProps) {
  const difficultyColors = {
    easy: "bg-emerald-100 text-emerald-800 border-emerald-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    hard: "bg-rose-100 text-rose-800 border-rose-200",
  };

  const difficultyIcons = {
    easy: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    medium: "M13 10V3L4 14h7v7l9-11h-7z",
    hard: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  };

  return (
    <Link href={`/challenges/${packId}/${challenge.id}`} className="group">
      <div
        className={cn(
          "relative h-full bg-white border-2 border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1",
          completed && "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md",
          !completed && "hover:border-blue-300",
          className
        )}
      >
        {/* Challenge Number Badge */}
        {index && (
          <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
            {index}
          </div>
        )}

        <div className="space-y-4">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors pr-6">
            {challenge.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {challenge.prompt}
          </p>

          {/* Tags and Difficulty */}
          <div className="flex gap-2 flex-wrap pt-2 border-t border-gray-100">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border",
                difficultyColors[challenge.difficulty]
              )}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={difficultyIcons[challenge.difficulty]} />
              </svg>
              {challenge.difficulty}
            </span>

            {challenge.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
              >
                {tag}
              </span>
            ))}
            {challenge.tags.length > 2 && (
              <span className="inline-flex items-center px-2 py-1.5 rounded-lg text-xs font-medium text-gray-500">
                +{challenge.tags.length - 2}
              </span>
            )}
          </div>

          {/* Start Button */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all">
              <span>{completed ? "Review Challenge" : "Start Challenge"}</span>
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
