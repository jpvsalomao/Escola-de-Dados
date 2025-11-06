"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Editor } from "@/app/components/Editor";
import { ResultGrid } from "@/app/components/ResultGrid";
import { loadPack, loadPackDatasets } from "@/app/lib/pack";
import { gradeQuery } from "@/app/lib/grader";
import { executeQuery, getTableSchema } from "@/app/lib/duck";
import { markCompleted, recordAttempt, getProgress } from "@/app/lib/progress";
import { logChallengeAttempt } from "@/app/lib/telemetry";
import type { Challenge, GradeResult, PackSchema } from "@/app/lib/types";

export default function ChallengePage() {
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
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [tableSchemas, setTableSchemas] = useState<Record<string, Array<{ name: string; type: string }>>>({});
  const [duckdbReady, setDuckdbReady] = useState(false);

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

  async function handleRun() {
    if (!sql.trim()) {
      setError("Please enter a SQL query");
      return;
    }

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading challenge...</p>
          <p className="text-sm text-gray-500 mt-2">Preparing your SQL playground</p>
        </div>
      </div>
    );
  }

  if (error && !challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Error</h2>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/" className="btn-primary inline-block">
            Return to Challenges
          </Link>
        </div>
      </div>
    );
  }

  if (!challenge || !pack) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Challenge not found</h2>
          <p className="text-gray-500 mb-4">This challenge doesn't exist or has been removed.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors group"
                aria-label="Back to challenges"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Back to Challenges</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 hidden sm:block" />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">{challenge.title}</h1>
                  {progress?.completed && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Completed
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
                      <span>Attempts: {progress.attempts}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left panel - Instructions (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Challenge Description */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Challenge</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{challenge.prompt}</p>

              {progress?.completed && progress.bestTime && (
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-700 font-medium">
                    Best time: {progress.bestTime.toFixed(0)}ms
                  </span>
                </div>
              )}
            </div>

            {/* Available Tables */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">Available Tables</h3>
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
                        <svg className={`w-4 h-4 text-purple-600 transition-transform ${expandedTables.has(ds.name) ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <div className="border-t border-gray-200 bg-gray-50">
                        {tableSchemas[ds.name] ? (
                          <div className="p-3">
                            <div className="space-y-2">
                              {tableSchemas[ds.name].map((column) => (
                                <div key={column.name} className="flex items-center justify-between text-sm bg-white rounded px-3 py-2 border border-gray-200">
                                  <span className="font-mono font-medium text-gray-900">{column.name}</span>
                                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-mono">{column.type}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 text-center">
                            <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                            <p className="text-xs text-gray-500 mt-2">Loading schema...</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Hint */}
            {challenge.hint && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold w-full"
                >
                  <svg className={`w-5 h-5 transition-transform ${showHint ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {showHint ? "Hide Hint" : "Need a Hint?"}
                </button>
                {showHint && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-gray-700 text-sm leading-relaxed">{challenge.hint}</p>
                  </div>
                )}
              </div>
            )}

            {/* Solution */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="flex items-center gap-2 text-orange-600 hover:text-orange-800 font-semibold w-full"
              >
                <svg className={`w-5 h-5 transition-transform ${showSolution ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {showSolution ? "Hide Solution" : "View Solution"}
              </button>
              {showSolution && (
                <div className="mt-4">
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
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Your SQL</h2>
                </div>
                {sql.trim() && (
                  <button
                    onClick={() => setSql("")}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear
                  </button>
                )}
              </div>

              <Editor value={sql} onChange={setSql} className="mb-4" />

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleRun}
                  disabled={running}
                  className="btn-primary flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {running ? "Running..." : "Run Query"}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={running}
                  className="btn-success flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {running ? "Submitting..." : "Submit Answer"}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-sm animate-in slide-in-from-top">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-red-900 mb-1">Error</h4>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Grade Result */}
            {gradeResult && (
              <div className={`border-2 rounded-2xl p-6 shadow-sm animate-in slide-in-from-top ${
                gradeResult.pass
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}>
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    gradeResult.pass ? "bg-green-100" : "bg-red-100"
                  }`}>
                    {gradeResult.pass ? (
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
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
                      gradeResult.pass ? "text-green-900" : "text-red-900"
                    }`}>
                      {gradeResult.pass ? "All Tests Passed!" : "Some Tests Failed"}
                    </h3>
                    <ul className="space-y-2">
                      {gradeResult.checks.map((check, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="flex-shrink-0 mt-0.5">
                            {check.pass ? (
                              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            )}
                          </span>
                          <div className={gradeResult.pass ? "text-green-800" : "text-red-800"}>
                            <span className="font-medium">{check.name}</span>
                            {check.message && (
                              <span className="block text-xs mt-0.5 opacity-75">{check.message}</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className={`mt-4 pt-4 border-t flex items-center gap-4 text-sm ${
                      gradeResult.pass ? "border-green-200 text-green-700" : "border-red-200 text-red-700"
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{gradeResult.stats.elapsedMs.toFixed(2)}ms</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>{gradeResult.stats.rowsReturned} rows</span>
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
                    Results <span className="text-sm font-normal text-gray-500">({results.length} rows)</span>
                  </h3>
                </div>
                <ResultGrid data={results} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
