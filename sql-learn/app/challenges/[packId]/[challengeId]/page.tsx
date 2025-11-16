"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Editor } from "@/app/components/Editor";
import { ResultGrid } from "@/app/components/ResultGrid";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import { KeyboardShortcuts } from "@/app/components/KeyboardShortcuts";
import { Confetti } from "@/app/components/Confetti";
import { AnimatedNumber } from "@/app/components/AnimatedNumber";
import { useTranslation } from "@/app/lib/useTranslation";
import { loadPack, loadPackDatasets } from "@/app/lib/pack";
import { gradeQuery } from "@/app/lib/grader";
import { executeQuery, getTableSchema } from "@/app/lib/duck";
import { markCompleted, recordAttempt, getProgress } from "@/app/lib/progress";
import { logChallengeAttempt } from "@/app/lib/telemetry";
import type { Challenge, GradeResult, PackSchema } from "@/app/lib/types";

export default function ChallengePage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const packId = params.packId as string;
  const challengeId = params.challengeId as string;

  const [pack, setPack] = useState<PackSchema | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [sql, setSql] = useState("");
  const [results, setResults] = useState<Record<string, unknown>[]>([]);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState(0); // 0 = none, 1 = tier1, 2 = tier2, 3 = tier3
  const [showSolution, setShowSolution] = useState(false);
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [tableSchemas, setTableSchemas] = useState<Record<string, Array<{ name: string; type: string }>>>({});
  const [duckdbReady, setDuckdbReady] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const loadedPack = await loadPack(`/packs/${packId}`);
        setPack(loadedPack);

        const foundChallenge = loadedPack.challenges.find((c) => c.id === challengeId);
        if (!foundChallenge) {
          setError("Challenge not found");
          setLoading(false);
          return;
        }
        setChallenge(foundChallenge);

        // Load datasets into DuckDB
        await loadPackDatasets(`/packs/${packId}`, loadedPack);

        // Preload all table schemas to avoid "not initialized" errors
        const schemas: Record<string, Array<{ name: string; type: string }>> = {};
        for (const dataset of loadedPack.datasets) {
          try {
            const schema = await getTableSchema(dataset.name);
            schemas[dataset.name] = schema;
          } catch (err) {
            console.error(`Failed to preload schema for ${dataset.name}:`, err);
          }
        }
        setTableSchemas(schemas);

        // Mark DuckDB as ready after datasets are loaded
        setDuckdbReady(true);

        // Clear any initialization errors
        setError(null);

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load challenge");
        setLoading(false);
      }
    }

    loadData();
  }, [packId, challengeId]);

  // Keyboard shortcuts
  const handleRunQuery = useCallback(async () => {
    if (!sql.trim() || running) return;
    
    setRunning(true);
    setError(null);
    setResults([]);
    setGradeResult(null);

    try {
      const data = await executeQuery(sql);
      setResults(data as Record<string, unknown>[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Query execution failed");
    } finally {
      setRunning(false);
    }
  }, [sql, running]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to run query
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRunQuery();
      }
      // Escape to clear results
      if (e.key === "Escape") {
        if (gradeResult || results.length > 0 || error) {
          e.preventDefault();
          setResults([]);
          setGradeResult(null);
          setError(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRunQuery, gradeResult, results, error]);

  function handleRun() {
    handleRunQuery();
  }

  async function handleSubmit() {
    if (!sql.trim() || !challenge) {
      setError("Please enter a SQL query");
      return;
    }

    setRunning(true);
    setError(null);
    setGradeResult(null);

    try {
      const result = await gradeQuery(sql, challenge.tests);
      setGradeResult(result);

      if (result.pass) {
        markCompleted(packId, challengeId, result.stats.elapsedMs);
        logChallengeAttempt(packId, challengeId, true, result.stats.elapsedMs);
        // Trigger confetti celebration
        setShowConfetti(true);
      } else {
        recordAttempt(packId, challengeId);
        logChallengeAttempt(packId, challengeId, false, result.stats.elapsedMs);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Grading failed");
      recordAttempt(packId, challengeId);
    } finally {
      setRunning(false);
    }
  }

  async function toggleTableExpansion(tableName: string) {
    // Don't allow expansion if DuckDB is not ready
    if (!duckdbReady) {
      console.warn("DuckDB is still loading, please wait...");
      return;
    }

    const newExpanded = new Set(expandedTables);

    if (newExpanded.has(tableName)) {
      // Collapse
      newExpanded.delete(tableName);
    } else {
      // Expand - fetch schema if not already cached
      newExpanded.add(tableName);
      if (!tableSchemas[tableName]) {
        try {
          const schema = await getTableSchema(tableName);
          setTableSchemas(prev => ({ ...prev, [tableName]: schema }));
        } catch (err) {
          console.error(`Failed to fetch schema for ${tableName}:`, err);
          // Remove from expanded if fetch failed
          newExpanded.delete(tableName);
        }
      }
    }

    setExpandedTables(newExpanded);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Skeleton */}
          <div className="mb-6">
            <div className="h-5 bg-gray-200 rounded w-64 relative overflow-hidden">
              <div className="absolute inset-0 shimmer" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Challenge Info Skeleton */}
            <div className="space-y-6">
              {/* Challenge Header */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 shimmer" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full relative overflow-hidden">
                    <div className="absolute inset-0 shimmer" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 relative overflow-hidden">
                    <div className="absolute inset-0 shimmer" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-4/6 relative overflow-hidden">
                    <div className="absolute inset-0 shimmer" />
                  </div>
                </div>
              </div>

              {/* Schema Skeleton */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 shimmer" />
                </div>
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded relative overflow-hidden">
                      <div className="absolute inset-0 shimmer" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Editor Skeleton */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <div className="h-6 bg-gray-200 rounded w-24 mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 shimmer" />
                </div>
                <div className="h-64 bg-gray-100 rounded relative overflow-hidden">
                  <div className="absolute inset-0 shimmer" />
                </div>
                <div className="flex gap-3 mt-4">
                  <div className="h-10 bg-gray-200 rounded w-24 relative overflow-hidden">
                    <div className="absolute inset-0 shimmer" />
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-24 relative overflow-hidden">
                    <div className="absolute inset-0 shimmer" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading Message with Animation */}
          <div className="fixed bottom-8 right-8 bg-white rounded-xl shadow-lg border border-gray-200 px-6 py-4 flex items-center gap-3">
            <div className="flex gap-1 loading-dots">
              <span className="w-2 h-2 bg-teal-600 rounded-full inline-block"></span>
              <span className="w-2 h-2 bg-teal-600 rounded-full inline-block"></span>
              <span className="w-2 h-2 bg-teal-600 rounded-full inline-block"></span>
            </div>
            <p className="text-sm font-medium text-gray-700">{t("challenge.loading_message")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-teal-50">
        <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{t("challenge.error_title")}</h2>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/" className="btn-primary inline-block">
            {t("challenge.back_to_challenges")}
          </Link>
        </div>
      </div>
    );
  }

  if (!challenge || !pack) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-teal-50">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Challenge not found</h2>
          <p className="text-gray-500 mb-4">This challenge doesn&apos;t exist or has been removed.</p>
          <Link href="/" className="btn-primary inline-block">
            Return to Challenges
          </Link>
        </div>
      </div>
    );
  }

  const progress = getProgress(packId, challengeId);

  const difficultyColors = {
    easy: "bg-emerald-100 text-emerald-800 border-emerald-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    hard: "bg-rose-100 text-rose-800 border-rose-200",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Enhanced Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href={`/packs/${packId}`}
                className="flex items-center gap-2 text-teal-600 hover:text-teal-800 font-medium transition-colors group"
                aria-label="Back to challenges"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">{t("challenge.back_to_challenges")}</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 hidden sm:block" />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">{challenge.title}</h1>
                  {progress?.completed && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {t("challenge.completed_badge")}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <span>{pack.title}</span>
                  <span>•</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${difficultyColors[challenge.difficulty]}`}>
                    {challenge.difficulty}
                  </span>
                  {progress && (
                    <>
                      <span>•</span>
                      <span>{t("challenge.attempts")}: {progress.attempts}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: pack.title, href: `/packs/${packId}` },
            { label: challenge.title }
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left panel - Instructions (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Challenge Description */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Challenge</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{challenge.prompt}</p>

              {progress?.completed && progress.bestTime && (
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-emerald-700 font-medium">
                    Best time: {progress.bestTime.toFixed(0)}ms
                  </span>
                </div>
              )}
            </div>

            {/* Available Tables */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">{t("challenge.available_tables")}</h3>
              </div>
              <div className="space-y-3">
                {pack.datasets.map((ds) => (
                  <div key={ds.name} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleTableExpansion(ds.name)}
                      disabled={!duckdbReady}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-2">
                        <svg className={`w-4 h-4 text-indigo-600 transition-transform ${expandedTables.has(ds.name) ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-mono font-medium text-gray-900">{ds.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        {expandedTables.has(ds.name) && tableSchemas[ds.name] && (
                          <span>{tableSchemas[ds.name].length} columns</span>
                        )}
                      </div>
                    </button>

                    {expandedTables.has(ds.name) && (
                      <div className="border-t border-gray-200 bg-gray-50 slide-down">
                        {tableSchemas[ds.name] ? (
                          <div className="p-3">
                            <div className="space-y-2">
                              {tableSchemas[ds.name].map((column, idx) => (
                                <div
                                  key={column.name}
                                  className="flex items-center justify-between text-sm bg-white rounded px-3 py-2 border border-gray-200 stagger-fade-in"
                                  style={{ animationDelay: `${idx * 30}ms` }}
                                >
                                  <span className="font-mono font-medium text-gray-900">{column.name}</span>
                                  <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded font-mono">{column.type}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 text-center">
                            <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                            <p className="text-xs text-gray-500 mt-2">Loading schema...</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <KeyboardShortcuts />

            {/* Progressive Hints */}
            {(challenge.hints || challenge.hint) && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 text-teal-600 font-semibold mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>{t("challenge.hints_title")}</span>
                </div>

                {/* Progressive hint buttons and content */}
                {challenge.hints ? (
                  <div className="space-y-3">
                    {/* Tier 1: Gentle Nudge */}
                    {challenge.hints.tier1 && (
                      <div>
                        {hintLevel < 1 ? (
                          <button
                            onClick={() => setHintLevel(1)}
                            className="w-full px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            {t("challenge.hint_tier1")}
                          </button>
                        ) : (
                          <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg slide-down">
                            <div className="flex items-start gap-2">
                              <span className="text-lg">💡</span>
                              <p className="text-gray-700 text-sm leading-relaxed flex-1">{challenge.hints.tier1}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tier 2: More Direction */}
                    {challenge.hints.tier2 && hintLevel >= 1 && (
                      <div>
                        {hintLevel < 2 ? (
                          <button
                            onClick={() => setHintLevel(2)}
                            className="w-full px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            {t("challenge.hint_tier2")}
                          </button>
                        ) : (
                          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg slide-down">
                            <div className="flex items-start gap-2">
                              <span className="text-lg">🎯</span>
                              <p className="text-gray-700 text-sm leading-relaxed flex-1">{challenge.hints.tier2}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tier 3: Near-Solution */}
                    {challenge.hints.tier3 && hintLevel >= 2 && (
                      <div>
                        {hintLevel < 3 ? (
                          <button
                            onClick={() => setHintLevel(3)}
                            className="w-full px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            {t("challenge.hint_tier3")}
                          </button>
                        ) : (
                          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg slide-down">
                            <div className="flex items-start gap-2">
                              <span className="text-lg">🔥</span>
                              <p className="text-gray-700 text-sm leading-relaxed flex-1">{challenge.hints.tier3}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reset hints button */}
                    {hintLevel > 0 && (
                      <button
                        onClick={() => setHintLevel(0)}
                        className="text-xs text-gray-500 hover:text-gray-700 mt-2"
                      >
                        {t("challenge.hide_hints")}
                      </button>
                    )}
                  </div>
                ) : (
                  /* Fallback for old single-hint format */
                  <div>
                    {hintLevel === 0 ? (
                      <button
                        onClick={() => setHintLevel(1)}
                        className="w-full px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        💡 Show Hint
                      </button>
                    ) : (
                      <>
                        <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg slide-down">
                          <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-700 text-sm leading-relaxed flex-1">{challenge.hint}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setHintLevel(0)}
                          className="text-xs text-gray-500 hover:text-gray-700 mt-2"
                        >
                          Hide hint
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Solution */}
            <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 shadow-sm">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="flex items-center gap-2 text-amber-700 hover:text-amber-900 font-semibold w-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-lg p-1 -m-1"
                aria-expanded={showSolution}
                aria-controls="solution-content"
              >
                <svg className={`w-5 h-5 transition-transform duration-300 ${showSolution ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {showSolution ? t("challenge.hide_solution") : t("challenge.view_solution")}
                </span>
              </button>
              {showSolution && (
                <div id="solution-content" className="mt-4 animate-in fade-in duration-300">
                  <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-900">
                      {t("challenge.solution_warning")}
                    </p>
                  </div>
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <p className="text-sm text-blue-900">
                        💡 <strong>Learning Tip:</strong> Try to understand why this solution works, not just copy it. Look at each part of the query and think about what it does.
                      </p>
                    </div>
                  </div>
                  <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto font-mono">
                    {challenge.solution_sql}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Right panel - Editor & Results (3 columns) */}
          <div className="lg:col-span-3 space-y-4">
            {/* SQL Editor */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{t("challenge.your_sql")}</h2>
                </div>
                {sql.trim() && (
                  <button
                    onClick={() => setSql("")}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {t("challenge.clear")}
                  </button>
                )}
              </div>

              <Editor value={sql} onChange={setSql} className="mb-4" />

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleRun}
                  disabled={running}
                  className="btn-primary flex items-center gap-2"
                  title="Run Query (Ctrl+Enter)"
                >
                  {running ? (
                    <>
                      <div className="inline-flex items-center gap-1 loading-dots">
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      </div>
                      <span>{t("challenge.running")}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t("challenge.run_query")}
                    </>
                  )}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={running}
                  className="btn-success flex items-center gap-2"
                >
                  {running ? (
                    <>
                      <div className="inline-flex items-center gap-1 loading-dots">
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      </div>
                      <span>{t("challenge.submitting")}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t("challenge.submit_answer")}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div 
                className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-sm animate-in slide-in-from-top"
                role="alert"
                aria-live="assertive"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-red-900 mb-1">{t("challenge.error_title")}</h4>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Grade Result */}
            {gradeResult && (
              <div
                className={`border-2 rounded-2xl p-6 shadow-sm animate-in slide-in-from-top ${
                  gradeResult.pass
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-red-50 border-red-200"
                }`}
                role={gradeResult.pass ? "status" : "alert"}
                aria-live="polite"
                aria-atomic="true"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      gradeResult.pass ? "bg-emerald-100" : "bg-red-100"
                    }`}
                    aria-hidden="true"
                  >
                    {gradeResult.pass ? (
                      <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${
                      gradeResult.pass ? "text-emerald-900" : "text-red-900"
                    }`}>
                      {gradeResult.pass ? t("challenge.success_title") : t("challenge.not_quite_title")}
                    </h3>
                    {gradeResult.pass ? (
                      <p className="text-sm text-emerald-700 mb-3">
                        {t("challenge.success_message")}
                      </p>
                    ) : (
                      <p className="text-sm text-red-700 mb-3">
                        {t("challenge.not_quite_message")}
                      </p>
                    )}
                    <ul className="space-y-2">
                      {gradeResult.checks.map((check, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm stagger-fade-in"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <span className="flex-shrink-0 mt-0.5">
                            {check.pass ? (
                              <svg className="w-5 h-5 text-emerald-600 animate-bounce-in" fill="none" stroke="currentColor" viewBox="0 0 20 20" strokeWidth={2}>
                                <path className="checkmark-draw" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            )}
                          </span>
                          <div className={gradeResult.pass ? "text-emerald-800" : "text-red-800"}>
                            <span className="font-medium">{check.name}</span>
                            {check.message && (
                              <span className="block text-xs mt-0.5 opacity-75">{check.message}</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className={`mt-4 pt-4 border-t flex items-center gap-4 text-sm ${
                      gradeResult.pass ? "border-emerald-200 text-emerald-700" : "border-red-200 text-red-700"
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <AnimatedNumber value={gradeResult.stats.elapsedMs} decimals={2} suffix="ms" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <AnimatedNumber value={gradeResult.stats.rowsReturned} decimals={0} suffix=" rows" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Query Results */}
            {results.length > 0 && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900">
                    {results.length === 1 ? t("challenge.results_title", { count: results.length }) : t("challenge.results_title_plural", { count: results.length })}
                  </h3>
                </div>
                <ResultGrid data={results} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Confetti Celebration */}
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
    </div>
  );
}
