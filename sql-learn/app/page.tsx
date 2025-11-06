"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChallengeCard } from "./components/ChallengeCard";
import { ProgressBadge } from "./components/ProgressBadge";
import { loadPack } from "./lib/pack";
import { getAllProgress, getPackCompletionPercentage } from "./lib/progress";
import type { PackSchema } from "./lib/types";

export default function HomePage() {
  const [pack, setPack] = useState<PackSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const loadedPack = await loadPack("/packs/pack_basics");
        setPack(loadedPack);

        const percentage = getPackCompletionPercentage(
          loadedPack.id,
          loadedPack.challenges.length
        );
        setCompletionPercentage(percentage);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load pack");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading challenges...</p>
        </div>
      </div>
    );
  }

  if (error || !pack) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Error Loading Pack</h2>
          </div>
          <p className="text-red-600">{error || "Pack not found"}</p>
        </div>
      </div>
    );
  }

  const progress = getAllProgress();
  const completedChallenges = new Set(
    progress.filter((p) => p.completed).map((p) => p.challengeId)
  );

  // Group challenges by category
  const challengesByCategory = {
    basic: {
      title: "Basic Queries",
      icon: "document-text",
      description: "Learn SELECT and WHERE fundamentals",
      color: "blue",
      challenges: pack.challenges.filter(c =>
        c.tags.includes("select") || c.tags.includes("basics") || c.tags.includes("where") || c.tags.includes("filter")
      )
    },
    aggregation: {
      title: "Aggregations",
      icon: "calculator",
      description: "Master COUNT, SUM, and GROUP BY",
      color: "purple",
      challenges: pack.challenges.filter(c =>
        c.tags.includes("aggregate") || c.tags.includes("count") || c.tags.includes("group by") || c.tags.includes("sum")
      )
    },
    sorting: {
      title: "Sorting",
      icon: "sort-ascending",
      description: "Order your results with ORDER BY",
      color: "green",
      challenges: pack.challenges.filter(c =>
        c.tags.includes("order by") || c.tags.includes("sorting")
      )
    }
  };

  // Remove duplicates - a challenge might appear in multiple categories
  const seenChallenges = new Set();
  Object.values(challengesByCategory).forEach(category => {
    category.challenges = category.challenges.filter(c => {
      if (seenChallenges.has(c.id)) return false;
      seenChallenges.add(c.id);
      return true;
    });
  });

  // Calculate section progress
  const getSectionProgress = (challenges: typeof pack.challenges) => {
    const completed = challenges.filter(c => completedChallenges.has(c.id)).length;
    const total = challenges.length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const colorClasses = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    green: "bg-green-100 text-green-700 border-green-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200"
  };

  const iconComponents = {
    "document-text": (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
    "calculator": (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    ),
    "sort-ascending": (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
    )
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">SQL Learn</h1>
              <p className="text-gray-600 mt-1 text-lg">Interactive SQL challenges from Escola de Dados</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Pack Header Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{pack.title}</h2>
              <div className="flex flex-wrap gap-2">
                {pack.metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0">
              <ProgressBadge percentage={completionPercentage} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Author</p>
                <p className="font-semibold text-gray-900">{pack.metadata.author}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Challenges</p>
                <p className="font-semibold text-gray-900">{pack.challenges.length} exercises</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Difficulty</p>
                <p className="font-semibold text-gray-900">Beginner friendly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Challenges by Category */}
        <div className="space-y-8">
          {Object.entries(challengesByCategory).map(([key, category]) => {
            if (category.challenges.length === 0) return null;

            const sectionProgress = getSectionProgress(category.challenges);

            return (
              <div key={key} className="space-y-4">
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[category.color as keyof typeof colorClasses]}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {iconComponents[category.icon as keyof typeof iconComponents]}
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>

                  {/* Section Progress */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {sectionProgress.completed}/{sectionProgress.total} completed
                      </p>
                      <p className="text-xs text-gray-500">{sectionProgress.percentage}%</p>
                    </div>
                    <div className="relative w-16 h-16">
                      <svg className="transform -rotate-90 w-16 h-16" viewBox="0 0 36 36">
                        {/* Background circle */}
                        <circle
                          cx="18"
                          cy="18"
                          r="15.5"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="3"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="18"
                          cy="18"
                          r="15.5"
                          fill="none"
                          stroke={sectionProgress.percentage === 100 ? '#10b981' : '#3b82f6'}
                          strokeWidth="3"
                          strokeDasharray={`${(sectionProgress.percentage / 100) * 97.4}, 97.4`}
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Percentage text in center */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-700">{sectionProgress.percentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Challenges Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {category.challenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      packId={pack.id}
                      completed={completedChallenges.has(challenge.id)}
                      index={pack.challenges.findIndex(c => c.id === challenge.id) + 1}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="mt-20 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              SQL Learn v1.0.0 - Built with Next.js, DuckDB-WASM, and Monaco Editor
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Practice SQL queries in your browser with instant feedback
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
