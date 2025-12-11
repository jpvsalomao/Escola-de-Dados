"use client";

import { useEffect, useState, useCallback, useTransition, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Editor } from "@/app/components/Editor";
import { ResultGrid } from "@/app/components/ResultGrid";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import { Confetti } from "@/app/components/Confetti";
import { AnimatedNumber } from "@/app/components/AnimatedNumber";
import { ChallengeTabs } from "@/app/components/ChallengeTabs";
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
  const [isPending, startTransition] = useTransition();

  // Refs to avoid recreating callbacks on every state change
  const sqlRef = useRef(sql);
  const gradeResultRef = useRef(gradeResult);
  const resultsRef = useRef(results);
  const errorRef = useRef(error);

  // Keep refs in sync with state
  useEffect(() => {
    sqlRef.current = sql;
  }, [sql]);

  useEffect(() => {
    gradeResultRef.current = gradeResult;
    resultsRef.current = results;
    errorRef.current = error;
  }, [gradeResult, results, error]);

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

  // Keyboard shortcuts - use ref to avoid recreating on every keystroke
  const handleRunQuery = useCallback(async () => {
    const currentSql = sqlRef.current;
    if (!currentSql.trim() || running) return;

    setRunning(true);
    setError(null);
    setResults([]);
    setGradeResult(null);

    try {
      const data = await executeQuery(currentSql);
      setResults(data as Record<string, unknown>[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Query execution failed");
    } finally {
      setRunning(false);
    }
  }, [running]); // sql removed from deps - using sqlRef instead

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to run query
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRunQuery();
      }
      // Escape to clear results - use refs to avoid frequent listener recreation
      if (e.key === "Escape") {
        if (gradeResultRef.current || resultsRef.current.length > 0 || errorRef.current) {
          e.preventDefault();
          setResults([]);
          setGradeResult(null);
          setError(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRunQuery]); // Minimal deps - using refs for frequently changing values

  function handleRun() {
    handleRunQuery();
  }

  // Memoized onChange handler for Editor to prevent unnecessary re-renders
  const handleSqlChange = useCallback((value: string) => {
    setSql(value);
  }, []);

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

      if (result.pass) {
        // 🎯 OPTIMIZATION: Trigger confetti IMMEDIATELY for instant feedback
        setShowConfetti(true);

        // Defer expensive operations to avoid blocking confetti animation
        queueMicrotask(() => {
          markCompleted(packId, challengeId, result.stats.elapsedMs);
          logChallengeAttempt(packId, challengeId, true, result.stats.elapsedMs);
        });

        // Use startTransition for non-urgent UI updates
        startTransition(() => {
          setGradeResult(result);
          setRunning(false);
        });
      } else {
        recordAttempt(packId, challengeId);
        logChallengeAttempt(packId, challengeId, false, result.stats.elapsedMs);
        setGradeResult(result);
        setRunning(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Grading failed");
      recordAttempt(packId, challengeId);
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
                  {challenge.estimatedMinutes && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ~{challenge.estimatedMinutes} min
                      </span>
                    </>
                  )}
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
          {/* Left panel - Tabbed Instructions (2 columns) */}
          <div className="lg:col-span-2">
            <ChallengeTabs
              challenge={challenge}
              pack={pack}
              packId={packId}
              challengeId={challengeId}
              userSql={sql}
              expandedTables={expandedTables}
              tableSchemas={tableSchemas}
              duckdbReady={duckdbReady}
              onToggleTable={toggleTableExpansion}
              hintLevel={hintLevel}
              onSetHintLevel={setHintLevel}
              showSolution={showSolution}
              onSetShowSolution={setShowSolution}
              bestTime={progress?.bestTime}
              completed={progress?.completed}
            />
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

              <Editor
                value={sql}
                onChange={handleSqlChange}
                className="mb-4"
                height={packId === "pack_meta_interview" ? "500px" : "300px"}
              />

              <div className="flex items-center justify-between flex-wrap gap-3">
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
                <span className="text-xs text-gray-400 hidden sm:block">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-500">Ctrl</kbd>
                  <span className="mx-1">+</span>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-500">Enter</kbd>
                  <span className="ml-1.5">to run</span>
                </span>
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
                        <AnimatedNumber value={gradeResult.stats.elapsedMs} decimals={2} suffix="ms" delay={300} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <AnimatedNumber value={gradeResult.stats.rowsReturned} decimals={0} suffix=" rows" delay={300} />
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
