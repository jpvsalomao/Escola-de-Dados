"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Challenge } from "@/app/lib/types";

// Skill group definition with pattern matching
interface SkillGroupDef {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  matchPatterns: string[];
}

interface SkillsChecklistProps {
  challenges: Challenge[];
  completedChallengeIds: Set<string>;
  packId: string;
}

// Define skill groups with pattern matching - 7 flexible groups
const SKILL_GROUP_DEFINITIONS: SkillGroupDef[] = [
  {
    id: "aggregation",
    title: "Aggregation & Counting",
    shortTitle: "Aggregation",
    description: "GROUP BY, HAVING, COUNT patterns",
    matchPatterns: ["Aggregation", "COUNT", "HAVING", "First Value", "Conditional Counting"],
  },
  {
    id: "joins",
    title: "Join Patterns",
    shortTitle: "Joins",
    description: "Self-joins, anti-joins, exclusion queries",
    matchPatterns: ["Anti-Join", "Self-Join", "Graph Query"],
  },
  {
    id: "sets",
    title: "Set Operations",
    shortTitle: "Sets",
    description: "INTERSECT, EXISTS, set membership",
    matchPatterns: ["Set Operations", "Existence"],
  },
  {
    id: "window",
    title: "Window Functions",
    shortTitle: "Windows",
    description: "OVER clause, ranking, partitions",
    matchPatterns: ["Window", "DENSE_RANK", "Rolling", "Deduplication", "ROW_NUMBER"],
  },
  {
    id: "running",
    title: "Running Calculations",
    shortTitle: "Running",
    description: "Cumulative sums, gap detection",
    matchPatterns: ["Running Total", "Gaps", "Islands", "Cumulative"],
  },
  {
    id: "rates",
    title: "Rates & Metrics",
    shortTitle: "Rates",
    description: "Percentages, ratios, period comparisons",
    matchPatterns: ["Rate", "Ratio", "Percentage", "CTEs", "Period Comparison", "YoY", "MoM"],
  },
  {
    id: "patterns",
    title: "Advanced Patterns",
    shortTitle: "Advanced",
    description: "State machines, histograms, complex logic",
    matchPatterns: ["State Machine", "Histogram"],
  },
];

// Get the PRIMARY skill group for a challenge (uses ONLY conceptExplanation.skill, not relatedSkills)
function getSkillGroupForChallenge(challenge: Challenge): string {
  const skill = challenge.conceptExplanation?.skill;
  if (!skill) return "other";

  for (const group of SKILL_GROUP_DEFINITIONS) {
    if (group.matchPatterns.some((p) => skill.toLowerCase().includes(p.toLowerCase()))) {
      return group.id;
    }
  }
  return "other";
}

// Get skill group definition by ID
function getSkillGroupById(groupId: string): SkillGroupDef | undefined {
  return SKILL_GROUP_DEFINITIONS.find((g) => g.id === groupId);
}

// Filter challenges by skill group
function getChallengesForGroup(challenges: Challenge[], groupId: string): Challenge[] {
  if (groupId === "all") return challenges;
  return challenges.filter((c) => getSkillGroupForChallenge(c) === groupId);
}

// Get active groups (groups that have at least one challenge)
function getActiveGroups(challenges: Challenge[]): SkillGroupDef[] {
  const activeGroupIds = new Set<string>();
  challenges.forEach((c) => {
    const groupId = getSkillGroupForChallenge(c);
    if (groupId !== "other") {
      activeGroupIds.add(groupId);
    }
  });
  return SKILL_GROUP_DEFINITIONS.filter((g) => activeGroupIds.has(g.id));
}

// Count challenges per group
function getChallengeCountPerGroup(
  challenges: Challenge[],
  completedChallengeIds: Set<string>
): Record<string, { total: number; completed: number }> {
  const counts: Record<string, { total: number; completed: number }> = {
    all: { total: challenges.length, completed: 0 },
  };

  SKILL_GROUP_DEFINITIONS.forEach((g) => {
    counts[g.id] = { total: 0, completed: 0 };
  });
  counts["other"] = { total: 0, completed: 0 };

  challenges.forEach((c) => {
    const groupId = getSkillGroupForChallenge(c);
    const isCompleted = completedChallengeIds.has(c.id);

    if (counts[groupId]) {
      counts[groupId].total++;
      if (isCompleted) counts[groupId].completed++;
    }

    if (isCompleted) counts.all.completed++;
  });

  return counts;
}

// Difficulty styling - simplified monochrome
function getDifficultyStyle(difficulty: string): string {
  switch (difficulty) {
    case "easy":
      return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "medium":
      return "text-amber-700 bg-amber-50 border-amber-200";
    case "hard":
      return "text-red-700 bg-red-50 border-red-200";
    default:
      return "text-gray-700 bg-gray-50 border-gray-200";
  }
}

export default function SkillsChecklist({
  challenges,
  completedChallengeIds,
  packId,
}: SkillsChecklistProps) {
  const [activeFilter, setActiveFilter] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`activeSkillFilter_${packId}`) || "all";
    }
    return "all";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`activeSkillFilter_${packId}`, activeFilter);
    }
  }, [activeFilter, packId]);

  const activeGroups = getActiveGroups(challenges);
  const counts = getChallengeCountPerGroup(challenges, completedChallengeIds);

  if (activeGroups.length === 0) {
    return null;
  }

  const filteredChallenges = getChallengesForGroup(challenges, activeFilter);
  const totalChallenges = challenges.length;
  const completedCount = counts.all.completed;
  const progressPercentage = totalChallenges > 0 ? Math.round((completedCount / totalChallenges) * 100) : 0;
  const activeGroupDef = activeFilter !== "all" ? getSkillGroupById(activeFilter) : null;

  return (
    <div className="space-y-6">
      {/* Compact Progress Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">SQL Interview Skills</h3>
          <span className="text-sm text-gray-600">
            <span className="font-bold text-teal-600">{completedCount}</span>
            <span className="text-gray-400">/{totalChallenges}</span>
            <span className="text-gray-400 ml-1">({progressPercentage}%)</span>
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-teal-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Filter Pills - Clean, Unified Style */}
      <div className="flex flex-wrap gap-2">
        {/* All Button */}
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeFilter === "all"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          All
          <span className={`ml-2 ${activeFilter === "all" ? "text-gray-400" : "text-gray-400"}`}>
            {counts.all.total}
          </span>
        </button>

        {/* Skill Group Buttons - All same style */}
        {activeGroups.map((group) => {
          const isActive = activeFilter === group.id;
          const groupCounts = counts[group.id];

          return (
            <button
              key={group.id}
              onClick={() => setActiveFilter(group.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-teal-300 hover:bg-teal-50"
              }`}
            >
              {group.shortTitle}
              <span className={`ml-2 ${isActive ? "text-teal-200" : "text-gray-400"}`}>
                {groupCounts.completed}/{groupCounts.total}
              </span>
            </button>
          );
        })}
      </div>

      {/* Section Header (when filtered) */}
      {activeFilter !== "all" && activeGroupDef && (
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div>
            <h4 className="font-semibold text-gray-900">{activeGroupDef.title}</h4>
            <p className="text-sm text-gray-500">{activeGroupDef.description}</p>
          </div>
          <span className="text-sm font-medium text-teal-600">
            {counts[activeFilter].completed}/{counts[activeFilter].total} completed
          </span>
        </div>
      )}

      {/* Challenge Grid - Clean Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredChallenges.map((challenge, idx) => {
          const isCompleted = completedChallengeIds.has(challenge.id);
          const challengeGroupId = getSkillGroupForChallenge(challenge);
          const challengeGroup = getSkillGroupById(challengeGroupId);

          // Find the original index in the full challenges array
          const originalIndex = challenges.findIndex(c => c.id === challenge.id) + 1;

          return (
            <Link
              key={challenge.id}
              href={`/challenges/${packId}/${challenge.id}`}
              className={`group block p-4 rounded-xl border transition-all hover:shadow-md ${
                isCompleted
                  ? "bg-emerald-50/50 border-emerald-200 hover:border-emerald-300"
                  : "bg-white border-gray-200 hover:border-teal-300"
              }`}
            >
              {/* Top Row: Number, Status, Time */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400">#{originalIndex}</span>
                  {isCompleted && (
                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                {challenge.estimatedMinutes && (
                  <span className="text-xs text-gray-400">{challenge.estimatedMinutes}m</span>
                )}
              </div>

              {/* Title */}
              <h5 className={`font-medium mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors ${
                isCompleted ? "text-emerald-800" : "text-gray-900"
              }`}>
                {challenge.title}
              </h5>

              {/* Bottom Row: Skill Tag + Difficulty */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Skill Tag - Only in "All" view, subtle style */}
                {activeFilter === "all" && challengeGroup && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {challengeGroup.shortTitle}
                  </span>
                )}

                {/* Difficulty Badge - Subtle */}
                <span className={`text-xs px-2 py-0.5 rounded border ${getDifficultyStyle(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredChallenges.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500">No challenges in this category</p>
        </div>
      )}
    </div>
  );
}
