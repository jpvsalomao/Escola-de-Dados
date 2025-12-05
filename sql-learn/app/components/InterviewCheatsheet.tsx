"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Challenge } from "@/app/lib/types";
import {
  CHEATSHEET_CATEGORIES,
  getChallengesForCategory,
  getKeyInsightsForCategory,
  getActiveCategories,
  type SkillCategory,
} from "@/app/lib/cheatsheet-data";

interface InterviewCheatsheetProps {
  challenges: Challenge[];
  completedChallengeIds: Set<string>;
  packId: string;
}

// Icon component for categories
function CategoryIcon({ name }: { name: string }) {
  const iconClasses = "w-5 h-5";

  switch (name) {
    case "calculator":
      return (
        <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    case "link":
      return (
        <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
    case "chart-bar":
      return (
        <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case "trending-up":
      return (
        <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    case "puzzle":
      return (
        <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      );
    default:
      return (
        <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
  }
}

export default function InterviewCheatsheet({
  challenges,
  completedChallengeIds,
  packId,
}: InterviewCheatsheetProps) {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`cheatsheetTab_${packId}`) || "aggregation";
    }
    return "aggregation";
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`cheatsheetExpanded_${packId}`);
      return saved ? saved === "true" : true;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`cheatsheetTab_${packId}`, activeTab);
    }
  }, [activeTab, packId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`cheatsheetExpanded_${packId}`, String(isExpanded));
    }
  }, [isExpanded, packId]);

  const activeCategories = getActiveCategories(challenges);
  const activeCategory = CHEATSHEET_CATEGORIES.find((c) => c.id === activeTab);
  const relatedChallenges = getChallengesForCategory(challenges, activeTab);
  const keyInsights = getKeyInsightsForCategory(challenges, activeTab);

  if (activeCategories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 mb-8 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
        aria-expanded={isExpanded}
        aria-controls="cheatsheet-content"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-900">Interview Cheatsheet</h3>
            <p className="text-sm text-gray-500">SQL patterns and formulas for quick reference</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content */}
      {isExpanded && (
        <div id="cheatsheet-content" className="border-t border-gray-100">
          {/* Tab Navigation */}
          <div className="flex overflow-x-auto border-b border-gray-100 px-4 py-2 gap-1 scrollbar-hide">
            {activeCategories.map((category) => {
              const isActive = activeTab === category.id;
              const challengeCount = getChallengesForCategory(challenges, category.id).length;

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-teal-100 text-teal-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  aria-selected={isActive}
                  role="tab"
                >
                  <CategoryIcon name={category.icon} />
                  <span>{category.shortTitle}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-teal-200 text-teal-800" : "bg-gray-200 text-gray-600"
                  }`}>
                    {challengeCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeCategory && (
            <div className="p-6" role="tabpanel">
              {/* Category Description */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">{activeCategory.title}</h4>
                <p className="text-sm text-gray-500">{activeCategory.description}</p>
              </div>

              {/* Patterns Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                {activeCategory.patterns.map((pattern, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-teal-200 transition-colors"
                  >
                    <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 bg-teal-100 text-teal-600 rounded-md flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      {pattern.name}
                    </h5>

                    {pattern.formula && (
                      <div className="bg-gray-900 text-gray-100 rounded-lg px-3 py-2 mb-3 font-mono text-xs overflow-x-auto">
                        {pattern.formula}
                      </div>
                    )}

                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium text-gray-700">Use for:</span> {pattern.useFor}
                    </p>

                    {pattern.pitfall && (
                      <p className="text-xs text-orange-700 bg-orange-50 rounded-lg px-3 py-2 border border-orange-100">
                        <span className="font-semibold">Pitfall:</span> {pattern.pitfall}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Key Insights from Challenges */}
              {keyInsights.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                    </svg>
                    Key Insights
                  </h5>
                  <div className="space-y-2">
                    {keyInsights.map((insight, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-sm text-gray-700 bg-emerald-50 rounded-lg px-4 py-2 border border-emerald-100"
                      >
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Challenges */}
              {relatedChallenges.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Practice These Skills
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {relatedChallenges.map((challenge) => {
                      const isCompleted = completedChallengeIds.has(challenge.id);
                      const challengeIndex = challenges.findIndex((c) => c.id === challenge.id) + 1;

                      return (
                        <Link
                          key={challenge.id}
                          href={`/challenges/${packId}/${challenge.id}`}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            isCompleted
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          {isCompleted && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span className="text-xs text-gray-400">#{challengeIndex}</span>
                          <span className="truncate max-w-[150px]">{challenge.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
