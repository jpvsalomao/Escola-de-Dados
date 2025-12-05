"use client";

import { useState } from "react";
import type { Challenge } from "@/app/lib/types";

interface Skill {
  name: string;
  challengeIds: string[];
  description: string;
}

interface SkillsChecklistProps {
  challenges: Challenge[];
  completedChallengeIds: Set<string>;
}

// Extract unique skills from challenges with conceptExplanation
function extractSkills(challenges: Challenge[]): Skill[] {
  const skillMap = new Map<string, { challengeIds: string[]; description: string }>();

  challenges.forEach((challenge) => {
    if (challenge.conceptExplanation) {
      const skillName = challenge.conceptExplanation.skill;
      const existing = skillMap.get(skillName);

      if (existing) {
        existing.challengeIds.push(challenge.id);
      } else {
        skillMap.set(skillName, {
          challengeIds: [challenge.id],
          description: challenge.conceptExplanation.keyInsight,
        });
      }
    }
  });

  return Array.from(skillMap.entries()).map(([name, data]) => ({
    name,
    challengeIds: data.challengeIds,
    description: data.description,
  }));
}

export default function SkillsChecklist({ challenges, completedChallengeIds }: SkillsChecklistProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const skills = extractSkills(challenges);

  if (skills.length === 0) {
    return null;
  }

  // Calculate how many skills are "mastered" (all related challenges completed)
  const masteredSkills = skills.filter((skill) =>
    skill.challengeIds.every((id) => completedChallengeIds.has(id))
  );

  const masteryPercentage = Math.round((masteredSkills.length / skills.length) * 100);

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl border-2 border-indigo-200 shadow-sm overflow-hidden mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-indigo-50/50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">SQL Interview Skills</h3>
            <p className="text-sm text-indigo-600">
              Master these {skills.length} patterns to be ready for any question
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600">{masteredSkills.length}/{skills.length}</div>
            <p className="text-xs text-gray-500">skills mastered</p>
          </div>
          <svg
            className={`w-5 h-5 text-indigo-600 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-indigo-100">
          {/* Progress bar */}
          <div className="mt-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Mastery</span>
              <span className="text-sm font-bold text-indigo-600">{masteryPercentage}%</span>
            </div>
            <div className="w-full bg-indigo-100 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-violet-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${masteryPercentage}%` }}
              />
            </div>
          </div>

          {/* Skills grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skills.map((skill) => {
              const isMastered = skill.challengeIds.every((id) =>
                completedChallengeIds.has(id)
              );
              const completedCount = skill.challengeIds.filter((id) =>
                completedChallengeIds.has(id)
              ).length;

              return (
                <div
                  key={skill.name}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                    isMastered
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isMastered
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {isMastered ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs font-medium">{completedCount}/{skill.challengeIds.length}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-sm ${isMastered ? "text-emerald-800" : "text-gray-800"}`}>
                      {skill.name}
                    </h4>
                    <p className={`text-xs mt-0.5 ${isMastered ? "text-emerald-600" : "text-gray-500"}`}>
                      {skill.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer message */}
          <div className="mt-4 pt-4 border-t border-indigo-100 text-center">
            <p className="text-xs text-indigo-600">
              {masteryPercentage === 100
                ? "You've mastered all SQL interview skills! You're ready for any question."
                : "Complete challenges to master each skill pattern."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
