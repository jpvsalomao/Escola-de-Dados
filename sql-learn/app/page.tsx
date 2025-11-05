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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !pack) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error || "Pack not found"}</div>
      </div>
    );
  }

  const progress = getAllProgress();
  const completedChallenges = new Set(
    progress.filter((p) => p.completed).map((p) => p.challengeId)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">SQL Learn</h1>
          <p className="text-gray-600 mt-1">Interactive SQL challenges from Escola de Dados</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">{pack.title}</h2>
            <ProgressBadge percentage={completionPercentage} />
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Author:</strong> {pack.metadata.author}
            </p>
            <p>
              <strong>Challenges:</strong> {pack.challenges.length}
            </p>
            <p>
              <strong>Tags:</strong> {pack.metadata.tags.join(", ")}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pack.challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              packId={pack.id}
              completed={completedChallenges.has(challenge.id)}
            />
          ))}
        </div>
      </main>

      <footer className="mt-16 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>SQL Learn v1.0.0 - Built with Next.js, DuckDB-WASM, and Monaco Editor</p>
        </div>
      </footer>
    </div>
  );
}
