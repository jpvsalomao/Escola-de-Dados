"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Editor } from "@/app/components/Editor";
import { ResultGrid } from "@/app/components/ResultGrid";
import { loadPack, loadPackDatasets } from "@/app/lib/pack";
import { gradeQuery } from "@/app/lib/grader";
import { executeQuery } from "@/app/lib/duck";
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading challenge...</div>
      </div>
    );
  }

  if (error && !challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!challenge || !pack) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Challenge not found</div>
      </div>
    );
  }

  const progress = getProgress(packId, challengeId);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
              aria-label="Back to challenges"
            >
              ← Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{challenge.title}</h1>
              <p className="text-sm text-gray-600">
                {pack.title} • {challenge.difficulty}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left panel - Instructions */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-2">Challenge</h2>
              <p className="text-gray-700">{challenge.prompt}</p>

              {progress && (
                <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                  <p>Attempts: {progress.attempts}</p>
                  {progress.completed && progress.bestTime && (
                    <p className="text-green-600 font-medium">
                      ✓ Completed • Best time: {progress.bestTime.toFixed(0)}ms
                    </p>
                  )}
                </div>
              )}
            </div>

            {challenge.hint && (
              <div className="bg-white p-6 rounded-lg border">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showHint ? "Hide Hint" : "Show Hint"}
                </button>
                {showHint && <p className="mt-2 text-gray-700">{challenge.hint}</p>}
              </div>
            )}

            <div className="bg-white p-6 rounded-lg border">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="text-orange-600 hover:text-orange-800 font-medium"
              >
                {showSolution ? "Hide Solution" : "Show Solution"}
              </button>
              {showSolution && (
                <pre className="mt-2 p-3 bg-gray-50 rounded text-sm overflow-x-auto">
                  {challenge.solution_sql}
                </pre>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">Available Tables</h3>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {pack.datasets.map((ds) => (
                  <li key={ds.name}>{ds.name}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right panel - Editor & Results */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-3">Your SQL</h2>
              <Editor value={sql} onChange={setSql} className="mb-4" />

              <div className="flex gap-2">
                <button
                  onClick={handleRun}
                  disabled={running}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {running ? "Running..." : "Run Query"}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={running}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {running ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg"
                role="alert"
              >
                <strong>Error:</strong> {error}
              </div>
            )}

            {gradeResult && (
              <div
                className={`p-4 rounded-lg border ${
                  gradeResult.pass
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
                role="status"
                aria-live="polite"
              >
                <h3 className="font-semibold mb-2">
                  {gradeResult.pass ? "✓ All tests passed!" : "✗ Some tests failed"}
                </h3>
                <ul className="text-sm space-y-1">
                  {gradeResult.checks.map((check, idx) => (
                    <li key={idx}>
                      {check.pass ? "✓" : "✗"} {check.name}
                      {check.message && <span className="text-gray-600"> - {check.message}</span>}
                    </li>
                  ))}
                </ul>
                <p className="text-sm mt-2">
                  Time: {gradeResult.stats.elapsedMs.toFixed(2)}ms • Rows:{" "}
                  {gradeResult.stats.rowsReturned}
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="font-semibold mb-3">Results ({results.length} rows)</h3>
                <ResultGrid data={results} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
