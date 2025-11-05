"use client";

import Link from "next/link";
import { cn } from "@/app/lib/utils";
import type { Challenge } from "@/app/lib/types";

interface ChallengeCardProps {
  challenge: Challenge;
  packId: string;
  completed?: boolean;
  className?: string;
}

export function ChallengeCard({
  challenge,
  packId,
  completed = false,
  className,
}: ChallengeCardProps) {
  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };

  return (
    <Link href={`/challenges/${packId}/${challenge.id}`}>
      <div
        className={cn(
          "p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer",
          completed && "border-green-500 bg-green-50",
          className
        )}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold">{challenge.title}</h3>
          {completed && (
            <span className="text-green-600 text-xl" aria-label="Completed">
              ✓
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-3">{challenge.prompt}</p>

        <div className="flex gap-2 flex-wrap">
          <span
            className={cn(
              "px-2 py-1 rounded text-xs font-medium",
              difficultyColors[challenge.difficulty]
            )}
          >
            {challenge.difficulty}
          </span>

          {challenge.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
