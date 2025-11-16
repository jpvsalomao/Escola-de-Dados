"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PackCard } from "./components/PackCard";
import { PackCardSkeleton } from "./components/PackCardSkeleton";
import { WelcomeModal } from "./components/WelcomeModal";
import { getAvailablePacks, loadPack } from "./lib/pack";
import { getPackCompletionPercentage } from "./lib/progress";
import type { PackSchema } from "./lib/types";

interface PackInfo {
  id: string;
  title: string;
  description: string;
  challengeCount: number;
  completionPercentage: number;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTimeMinutes?: number;
}

export default function HomePage() {
  const [packs, setPacks] = useState<PackInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPacks() {
      try {
        const availablePacks = await getAvailablePacks();

        // Load each pack to get full details
        const packsWithDetails = await Promise.all(
          availablePacks.map(async ({ id, path }) => {
            try {
              const pack: PackSchema = await loadPack(path);
              const completionPercentage = getPackCompletionPercentage(pack.id, pack.challenges.length);

              return {
                id: pack.id,
                title: pack.title,
                description: pack.description || `Master SQL fundamentals with ${pack.challenges.length} interactive challenges`,
                challengeCount: pack.challenges.length,
                completionPercentage,
                tags: pack.metadata.tags,
                difficulty: pack.metadata.difficulty || "beginner",
                estimatedTimeMinutes: pack.metadata.estimatedTimeMinutes,
              };
            } catch (err) {
              console.error(`Failed to load pack ${id}:`, err);
              return null;
            }
          })
        );

        setPacks(packsWithDetails.filter(p => p !== null) as PackInfo[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load packs");
      } finally {
        setLoading(false);
      }
    }

    loadPacks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        {/* Hero Header Skeleton */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 shimmer" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="h-12 bg-gray-200 rounded w-48 relative overflow-hidden">
                  <div className="absolute inset-0 shimmer" />
                </div>
                <div className="h-6 bg-gray-200 rounded w-96 max-w-full relative overflow-hidden">
                  <div className="absolute inset-0 shimmer" />
                </div>
              </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 shimmer" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-gray-200 rounded w-20 relative overflow-hidden">
                        <div className="absolute inset-0 shimmer" />
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-12 relative overflow-hidden">
                        <div className="absolute inset-0 shimmer" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 relative overflow-hidden">
              <div className="absolute inset-0 shimmer" />
            </div>
            <div className="h-5 bg-gray-200 rounded w-96 max-w-full relative overflow-hidden">
              <div className="absolute inset-0 shimmer" />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2].map((i) => (
              <PackCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Error Loading Packs</h2>
          </div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Calculate overall statistics
  const totalChallenges = packs.reduce((sum, pack) => sum + pack.challengeCount, 0);
  const averageCompletion = packs.length > 0
    ? Math.round(packs.reduce((sum, pack) => sum + pack.completionPercentage, 0) / packs.length)
    : 0;
  const completedPacks = packs.filter(p => p.completionPercentage === 100).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Hero Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl flex items-center justify-center shadow-lg"
              aria-hidden="true"
            >
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-5xl font-bold text-gray-900 tracking-tight">SQL Learn</h1>
              <p className="text-gray-600 mt-2 text-xl">Interactive SQL challenges from Escola de Dados</p>
            </div>
          </div>

          {/* Learn Concepts Banner */}
          <Link
            href="/concepts"
            className="group block mt-8 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 rounded-2xl p-5 border border-teal-200 hover:border-teal-300 transition-all duration-300 hover:shadow-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            aria-label="Learn SQL concepts before starting challenges"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                    📚 New to SQL? Start with the Concepts
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-teal-100 text-teal-700 rounded-md text-xs font-semibold border border-teal-200">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Beginner Friendly
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Learn SQL fundamentals with clear explanations, interactive examples, and visual demonstrations. Perfect for beginners or as a refresher before tackling challenges.
                </p>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 text-teal-600 group-hover:translate-x-1 transition-transform duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8" role="region" aria-label="Learning statistics">
            <div className="glass-strong rounded-xl p-4 border border-white/50 shadow-lg hover-glow-teal">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center" aria-hidden="true">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600" id="packs-label">Challenge Packs</p>
                  <p className="text-2xl font-bold text-gray-900" aria-labelledby="packs-label">{packs.length}</p>
                </div>
              </div>
            </div>

            <div className="glass-strong rounded-xl p-4 border border-white/50 shadow-lg hover-glow-coral">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center" aria-hidden="true">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600" id="challenges-label">Total Challenges</p>
                  <p className="text-2xl font-bold text-gray-900" aria-labelledby="challenges-label">{totalChallenges}</p>
                </div>
              </div>
            </div>

            <div className="glass-strong rounded-xl p-4 border border-white/50 shadow-lg hover-glow-green">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center" aria-hidden="true">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600" id="progress-label">Your Progress</p>
                  <p className="text-2xl font-bold text-gray-900" aria-labelledby="progress-label">{averageCompletion}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" role="main">
        {/* Section Title */}
        <section aria-labelledby="packs-heading">
          <div className="mb-8">
            <h2 id="packs-heading" className="text-3xl font-bold text-gray-900 mb-2">Available Challenge Packs</h2>
            <p className="text-gray-600">Choose a pack to start learning SQL through interactive challenges</p>
          </div>

          {/* Packs Grid */}
          {packs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-12 text-center" role="status">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Packs Available</h3>
              <p className="text-gray-600">Check back later for new challenge packs!</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {packs.map((pack) => (
                <PackCard
                  key={pack.id}
                  id={pack.id}
                  title={pack.title}
                  description={pack.description}
                  challengeCount={pack.challengeCount}
                  completionPercentage={pack.completionPercentage}
                  tags={pack.tags}
                  difficulty={pack.difficulty}
                  estimatedTimeMinutes={pack.estimatedTimeMinutes}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="mt-20 border-t border-gray-200 bg-white" role="contentinfo">
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

      {/* Welcome Modal for first-time users */}
      <WelcomeModal />
    </div>
  );
}
